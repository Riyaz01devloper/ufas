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

export const getProduct = async (req, res) => {
  const productId = parseInt(req.params.productId, 10);

  if (isNaN(productId)) {
    return res.status(400).json({
      message: "Invalid product ID",
    });
  }

  const productData = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!productData) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  res.status(200).json(productData);
};

export const updateProduct = async (req, res) => {
  const productId = parseInt(req.params.productId, 10);
  const productData = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!productData) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: {
      purchasingPrice: req.body.purchasingPrice
        ? parseFloat(req.body.purchasingPrice)
        : productData.purchasingPrice,
      sellingPrice: req.body.sellingPrice
        ? parseFloat(req.body.sellingPrice)
        : productData.sellingPrice,
      availableQuantity: req.body.availableQuantity
        ? parseInt(req.body.availableQuantity)
        : productData.availableQuantity,
      maxMargin: req.body.maxMargin
        ? parseFloat(req.body.maxMargin)
        : productData.maxMargin,
    },
  });

  res.json(updatedProduct);
};

export const deleteProduct = async (req, res) => {
  const productId = parseInt(req.params.productId, 10);
  const productData = await prisma.product.findUnique({
    where: { id: productId },
  });
  if (!productData) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  await prisma.product.delete({
    where: { id: productId },
  });

  res.json({ message: "Product deleted successfully" });
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
