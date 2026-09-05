import { validateContact, validateProduct } from "../utils/validate.js";
import { validationResult, matchedData } from "express-validator";
import { prisma } from "../../lib/prisma.js";

export const addContact = [
  ...validateContact,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: errors.array() });
    }
    const { type, mobile, city, state, pincode } = matchedData(req);
    const userId = req.user.id; // Assuming you have user authentication and the user ID is available in req.user
    const newContact = await prisma.contact.create({
      data: {
        type,
        mobile,
        city,
        state,
        pincode,
        userId,
      },
    });
    res
      .status(201)
      .json({ message: "Contact added successfully", contact: newContact });
  },
];

export const createProduct = [
  ...validateProduct,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: errors.array() });
    }
    const {
      name,
      brandName,
      type,
      category,
      purchasingPrice,
      sellingPrice,
      availableQuantity,
      maxMargin,
    } = matchedData(req);
    const newProduct = await prisma.product.create({
      data: {
        name,
        brandName,
        type,
        category,
        purchasingPrice,
        sellingPrice,
        availableQuantity,
        maxMargin,
      },
    });
    res.status(201).json(newProduct);
  },
];
