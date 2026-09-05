import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { prisma } from "../../lib/prisma.js";

export async function authenticate(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      message: "Access denied. No token provided.",
    });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    
    if (!user) {
      return res.status(401).json({
        message: "User no longer exists.",
      });
    }
    
    req.decoded = decoded;
    req.user = user;
    
    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid token.",
    });
  }
}
