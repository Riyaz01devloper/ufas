// import express from "express";

// import {
//     createProduct,
//     getProducts,
//     getProductById,
//     updateProduct,
//     deleteProduct,
//     getProductsByType,
//     getProductsByCategory,
//     getProductsByTypeAndCategory,
// } from "../controllers/product.controller.js";

// const router = express.Router();


// // Create product
// router.post("/", createProduct);

// // Get products by type + category
// router.get(
//     "/type/:type/category/:category",
//     getProductsByTypeAndCategory
// );

// // Get products by type
// router.get("/type/:type", getProductsByType);

// // Get products by category
// router.get("/category/:category", getProductsByCategory);

// // Get all products
// router.get("/", getProducts);

// // Get product by ID
// router.get("/:id", getProductById);

// // Update product
// router.put("/:id", updateProduct);

// // Delete product
// router.delete("/:id", deleteProduct);

// export default router;