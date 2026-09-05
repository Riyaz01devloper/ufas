import { prisma } from "../../lib/prisma.js";
import { body } from "express-validator";

export const validateRegistration = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be between 3 and 50 characters")
    .matches(/^[A-Za-z\s'-]+$/)
    .withMessage(
      "First name can only contain letters, spaces, hyphens, and apostrophes.",
    ),
  body("loginId")
    .trim()
    .notEmpty()
    .withMessage("Login ID is required")
    .isLength({ min: 6, max: 12 })
    .withMessage("Login ID must be between 6 and 12 characters")
    .custom(async (loginId) => {
      const existingUser = await prisma.user.findUnique({
        where: { loginId },
      });
      if (existingUser) {
        throw new Error("Login ID already in use");
      }
    }),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (email) => {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        throw new Error("Email already in use");
      }
    }),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 100 })
    .withMessage("Password must be between 8 and 100 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[\W_]/)
    .withMessage("Password must contain at least one special character"),
];

export const validateContact = [
  body("type")
    .trim()
    .notEmpty()
    .withMessage("Contact type is required")
    .isIn(["CUSTOMER", "VENDOR", "BOTH"])
    .withMessage("Contact type must be either 'CUSTOMER', 'VENDOR', or 'BOTH'"),

  body("mobile")
    .trim()
    .notEmpty()
    .withMessage("Mobile number is required")
    .isLength({ min: 10, max: 15 })
    .withMessage("Mobile number must be between 10 and 15 characters"),

  body("city").trim().notEmpty().withMessage("City is required"),

  body("state").trim().notEmpty().withMessage("State is required"),

  body("pincode")
    .trim()
    .notEmpty()
    .withMessage("Pincode is required")
    .isLength({ min: 5, max: 10 })
    .withMessage("Pincode must be between 5 and 10 characters"),
];
