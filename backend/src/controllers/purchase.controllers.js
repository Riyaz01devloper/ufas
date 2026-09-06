import { prisma } from "../../lib/prisma.js";

export const createPurchase = async (req, res) => {
  try {
    const vendorId = Number.parseInt(req.body.vendorId, 10);
    const productId = Number.parseInt(req.body.productId, 10);
    const accountId = Number.parseInt(req.body.accountId, 10);
    const quantity = Number.parseInt(req.body.quantity, 10);
    const unitPrice = Number.parseFloat(req.body.unitPrice);

    if (
      !Number.isInteger(vendorId) ||
      !Number.isInteger(productId) ||
      !Number.isInteger(accountId) ||
      !Number.isInteger(quantity) ||
      !Number.isFinite(unitPrice) ||
      quantity <= 0 ||
      unitPrice < 0
    ) {
      return res.status(400).json({
        message: "Invalid purchase data",
      });
    }

    const [vendor, product, account] = await Promise.all([
      prisma.contact.findUnique({
        where: { id: vendorId },
      }),

      prisma.product.findUnique({
        where: { id: productId },
      }),

      prisma.account.findUnique({
        where: { id: accountId },
      }),
    ]);

    if (!vendor) {
      return res.status(404).json({
        message: "Vendor not found",
      });
    }

    if (!["VENDOR", "BOTH"].includes(vendor.type)) {
      return res.status(400).json({
        message: "Selected contact is not a vendor",
      });
    }

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (!account) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    // Never trust totalAmount coming from the frontend.
    const totalAmount = quantity * unitPrice;

    const purchase = await prisma.$transaction(async (tx) => {
      const createdPurchase = await tx.purchase.create({
        data: {
          vendorId,
          productId,
          accountId,
          quantity,
          unitPrice,
          totalAmount,
        },

        include: {
          vendor: {
            include: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          },

          product: {
            select: {
              id: true,
              name: true,
            },
          },

          account: {
            select: {
              id: true,
              accountName: true,
              accountType: true,
            },
          },
        },
      });

      // A purchase increases available inventory.
      await tx.product.update({
        where: {
          id: productId,
        },

        data: {
          availableQuantity: {
            increment: quantity,
          },
        },
      });

      return createdPurchase;
    });

    return res.status(201).json({
      message: "Purchase created successfully",
      purchase,
    });
  } catch (error) {
    console.error("Error creating purchase:", error);

    return res.status(500).json({
      message: "Failed to create purchase",
    });
  }
};