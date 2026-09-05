import { prisma } from "../../lib/prisma.js";
import bcrypt from "bcrypt";
import { validateRegistration } from "../utils/validate.js";
import { validationResult, matchedData } from "express-validator";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import config from "../config/config.js";

export const registerUser = [
  ...validateRegistration,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: errors.array() });
    }
    const { name, loginId, email, password } = matchedData(req);
    const confirmPassword = req.body.confirmPassword;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        loginId,
        email,
        password: hashedPassword,
      },
    });
    const refreshToken = jwt.sign({ id: newUser.id }, config.JWT_SECRET, {
      expiresIn: "7d",
    });

    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const session = await prisma.session.create({
      data: {
        userId: newUser.id,
        refreshTokenHash: refreshTokenHash,
        ip: req.ip,
        userAgent: req.headers["user-agent"] || "Unknown",
      },
    });
    const accessToken = jwt.sign(
      { id: newUser.id, sessionId: session.id },
      config.JWT_SECRET,
      {
        expiresIn: "15m",
      },
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
      accessToken,
    });
  },
];

export async function login(req, res) {
  const { loginId, password } = req.body;

  const user = await prisma.user.findUnique({ where: { loginId } });

  if (!user) {
    return res.status(401).json({ message: "Invalid login ID or password" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid login ID or password" });
  }

  const refreshToken = jwt.sign({ id: user.id }, config.JWT_SECRET, {
    expiresIn: "7d",
  });

  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const session = await prisma.session.create({
    data: {
      userId: user.id,
      refreshTokenHash: refreshTokenHash,
      ip: req.ip,
      userAgent: req.headers["user-agent"] || "Unknown",
    },
  });

  const accessToken = jwt.sign(
    { id: user.id, sessionId: session.id },
    config.JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.json({
    message: "Login successful",
    user,
    accessToken,
  });
}

export async function getMe(req, res) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  const decoded = jwt.verify(token, config.JWT_SECRET);
  const user = await prisma.user.findUnique({ where: { id: decoded.id } });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json({ user });
}

export async function refreshToken(req, res) {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }
  const decoded = jwt.verify(refreshToken, config.JWT_SECRET);
  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const session = await prisma.session.findFirst({
    where: { refreshTokenHash, revoked: false },
  });

  if (!session) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }

  const accessToken = jwt.sign(
    { id: decoded.id, sessionId: session.id },
    config.JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );
  const newRefreshToken = jwt.sign({ id: decoded.id }, config.JWT_SECRET, {
    expiresIn: "7d",
  });
  const newRefreshTokenHash = crypto
    .createHash("sha256")
    .update(newRefreshToken)
    .digest("hex");

  await prisma.session.update({
    where: { id: session.id },
    data: { refreshTokenHash: newRefreshTokenHash },
  });
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  res.json({ message: "Access Token refreshed successfully", accessToken });
}

export async function logout(req, res) {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }
  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");
  const session = await prisma.session.findFirst({
    where: { refreshTokenHash, revoked: false },
  });

  if (!session) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }

  await prisma.session.update({
    where: { id: session.id },
    data: { revoked: true },
  });
  res.clearCookie("refreshToken");
  res.json({
    message: "Logged out successfully",
  });
}

export async function logoutAll(req, res) {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }
  const decoded = jwt.verify(refreshToken, config.JWT_SECRET);
  await prisma.session.updateMany({
    where: { userId: decoded.id, revoked: false },
    data: { revoked: true },
  });
  res.clearCookie("refreshToken");
  res.json({
    message: "Logged out of all sessions successfully",
  });
}
