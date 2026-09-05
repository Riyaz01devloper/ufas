// const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const { PrismaClient } = require("@prisma/client");

const createProduct = async (req, res) => {
    try {
        const {
            name,
            brandName,
            type,
            category,
            purchasingPrice,
            sellingPrice,
            availableQuantity,
            maxMargin,
        } = req.body;

        // Required fields
        if (
            !name ||
            !category ||
            purchasingPrice === undefined ||
            sellingPrice === undefined ||
            availableQuantity === undefined ||
            maxMargin === undefined
        ) {
            return res.status(400).json({
                message: "Required product fields are missing",
            });
        }

        // Validate numeric values
        if (Number(purchasingPrice) < 0) {
            return res.status(400).json({
                message: "Purchasing price cannot be negative",
            });
        }

        if (Number(sellingPrice) < 0) {
            return res.status(400).json({
                message: "Selling price cannot be negative",
            });
        }

        if (Number(availableQuantity) < 0) {
            return res.status(400).json({
                message: "Available quantity cannot be negative",
            });
        }

        // maxMargin represents percentage
        if (Number(maxMargin) < 0 || Number(maxMargin) > 1) {
            return res.status(400).json({
                message: "Max margin must be between 0 and 100 percent",
            });
        }

        const product = await prisma.product.create({
            data: {
                name: name.trim(),
                brandName: brandName?.trim() || null,

                // default GOODS
                type: type || "GOODS",

                category,

                purchasingPrice: Number(purchasingPrice),
                sellingPrice: Number(sellingPrice),
                availableQuantity: Number(availableQuantity),
                maxMargin: Number(maxMargin),
            },
        });

        return res.status(201).json({
            message: "Product created successfully",
            product,
        });

    } catch (error) {
        console.error("Create Product Error:", error);

        return res.status(500).json({
            message: "Failed to create product",
            error: error.message,
        });
    }
};



const getProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            orderBy: {
                id: "desc",
            },
        });

        return res.status(200).json({
            products,
        });

    } catch (error) {
        console.error("Get Products Error:", error);

        return res.status(500).json({
            message: "Failed to fetch products",
            error: error.message,
        });
    }
};



const getProductById = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Invalid product ID",
            });
        }

        const product = await prisma.product.findUnique({
            where: {
                id,
            },
        });

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        return res.status(200).json({
            product,
        });

    } catch (error) {
        console.error("Get Product Error:", error);

        return res.status(500).json({
            message: "Failed to fetch product",
            error: error.message,
        });
    }
};


const updateProduct = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Invalid product ID",
            });
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
        } = req.body;

        const existingProduct = await prisma.product.findUnique({
            where: {
                id,
            },
        });

        if (!existingProduct) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        // Validate purchasing price
        if (
            purchasingPrice !== undefined &&
            Number(purchasingPrice) < 0
        ) {
            return res.status(400).json({
                message: "Purchasing price cannot be negative",
            });
        }

        if (
            sellingPrice !== undefined &&
            Number(sellingPrice) < 0
        ) {
            return res.status(400).json({
                message: "Selling price cannot be negative",
            });
        }

        if (
            availableQuantity !== undefined &&
            Number(availableQuantity) < 0
        ) {
            return res.status(400).json({
                message: "Available quantity cannot be negative",
            });
        }

        if (
            maxMargin !== undefined &&
            (Number(maxMargin) < 0 || Number(maxMargin) > 1)
        ) {
            return res.status(400).json({
                message: "Max margin must be between 0 and 100 percent",
            });
        }

        const product = await prisma.product.update({
            where: {
                id,
            },

            data: {
                ...(name !== undefined && {
                    name: name.trim(),
                }),

                ...(brandName !== undefined && {
                    brandName: brandName?.trim() || null,
                }),

                ...(type !== undefined && {
                    type,
                }),

                ...(category !== undefined && {
                    category,
                }),

                ...(purchasingPrice !== undefined && {
                    purchasingPrice: Number(purchasingPrice),
                }),

                ...(sellingPrice !== undefined && {
                    sellingPrice: Number(sellingPrice),
                }),

                ...(availableQuantity !== undefined && {
                    availableQuantity: Number(availableQuantity),
                }),

                ...(maxMargin !== undefined && {
                    maxMargin: Number(maxMargin),
                }),
            },
        });

        return res.status(200).json({
            message: "Product updated successfully",
            product,
        });

    } catch (error) {
        console.error("Update Product Error:", error);

        return res.status(500).json({
            message: "Failed to update product",
            error: error.message,
        });
    }
};



const deleteProduct = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Invalid product ID",
            });
        }

        const existingProduct = await prisma.product.findUnique({
            where: {
                id,
            },
        });

        if (!existingProduct) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        await prisma.product.delete({
            where: {
                id,
            },
        });

        return res.status(200).json({
            message: "Product deleted successfully",
        });

    } catch (error) {
        console.error("Delete Product Error:", error);

        return res.status(500).json({
            message: "Failed to delete product",
            error: error.message,
        });
    }
};


const getProductsByType = async (req, res) => {
    try {
        const { type } = req.params;

        if (!type) {
            return res.status(400).json({
                message: "Product type is required",
            });
        }

        const products = await prisma.product.findMany({
            where: {
                type: type,
            },
        });

        return res.status(200).json({
            count: products.length,
            products,
        });

    } catch (error) {
        console.error("Get Products By Type Error:", error);

        return res.status(500).json({
            message: "Failed to fetch products by type",
            error: error.message,
        });
    }
};

const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;

        if (!category) {
            return res.status(400).json({
                message: "Furniture category is required",
            });
        }

        const products = await prisma.product.findMany({
            where: {
                category: category,
            },
        });

        return res.status(200).json({
            count: products.length,
            products,
        });

    } catch (error) {
        console.error("Get Products By Category Error:", error);

        return res.status(500).json({
            message: "Failed to fetch products by category",
            error: error.message,
        });
    }
};



const getProductsByTypeAndCategory = async (req, res) => {
    try {
        const { type, category } = req.params;

        if (!type || !category) {
            return res.status(400).json({
                message: "Product type and furniture category are required",
            });
        }

        const products = await prisma.product.findMany({
            where: {
                type: type,
                category: category,
            },
        });

        return res.status(200).json({
            count: products.length,
            products,
        });

    } catch (error) {
        console.error(
            "Get Products By Type And Category Error:",
            error
        );

        return res.status(500).json({
            message: "Failed to fetch products by type and category",
            error: error.message,
        });
    }
};

export {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getProductsByType,
    getProductsByCategory,
    getProductsByTypeAndCategory,
};