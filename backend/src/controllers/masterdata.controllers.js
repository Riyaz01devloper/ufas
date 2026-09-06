import {
  validateContact,
  validateProduct,
  validateAccount,
} from "../utils/validate.js";
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

export const getChartOfAccounts = async (req, res) => {
  try {
    const chartOfAccounts = await prisma.account.findMany();
    res.status(200).json(chartOfAccounts);
  } catch (error) {
    console.error("Error fetching chart of accounts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addChartOfAccounts = [
  ...validateAccount,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: errors.array() });
    }
    const { accountName, accountType } = matchedData(req);
    const newAccount = await prisma.account.create({
      data: {
        accountName,
        accountType,
      },
    });
    res.status(201).json(newAccount);
  },
];

export const deleteChartOfAccounts = async (req, res) => {
  const accountId = parseInt(req.params.accountId, 10);
  const accountData = await prisma.account.findUnique({
    where: { id: accountId },
  });
  if (!accountData) {
    return res.status(404).json({
      message: "Account not found",
    });
  }
  await prisma.account.delete({
    where: { id: accountId },
  });
  res.json({ message: "Account deleted successfully" });
};

export const getJournals = async (req, res) => {
  try {
    const journals = await prisma.journal.findMany();
    res.status(200).json(journals);
  } catch (error) {
    console.error("Error fetching journals:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyContact = async (req, res) => {
  try {
    const contact = await prisma.contact.findUnique({
      where: {
        userId: req.user.id,
      },
    });

    res.status(200).json({
      exists: !!contact,
      contact,
    });
  } catch (error) {
    console.error("Error fetching current user contact:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const [customers, vendors, products, accounts] = await Promise.all([
      prisma.contact.count({
        where: {
          type: {
            in: ["CUSTOMER", "BOTH"],
          },
        },
      }),

      prisma.contact.count({
        where: {
          type: {
            in: ["VENDOR", "BOTH"],
          },
        },
      }),

      prisma.product.count(),

      prisma.account.count(),
    ]);

    res.status(200).json({
      customers,
      vendors,
      products,
      accounts,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);

    res.status(500).json({
      message: "Failed to fetch dashboard statistics",
    });
  }
};

export const getSales = async (req, res) => {
  try {
    const sales = await prisma.sale.findMany({
      include: {
        customer: {
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
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(sales);
  } catch (error) {
    console.error("Error fetching sales:", error);

    res.status(500).json({
      message: "Failed to fetch sales",
    });
  }
};


export const getPurchases = async (req, res) => {
  try {
    const purchases = await prisma.purchase.findMany({
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
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(purchases);
  } catch (error) {
    console.error("Error fetching purchases:", error);

    res.status(500).json({
      message: "Failed to fetch purchases",
    });
  }
};


export const getReports = async (req, res) => {
  try {
    const [
      sales,
      purchases,
      expenses,
      expenseAccounts,
      customers,
      vendors,
    ] = await Promise.all([
      prisma.sale.findMany({
        include: {
          product: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),

      prisma.purchase.findMany({
        include: {
          product: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),

      prisma.expense.findMany({
        include: {
          account: {
            select: {
              id: true,
              accountName: true,
              accountType: true,
            },
          },
        },
      }),

      prisma.account.findMany({
        where: {
          accountType: {
            in: ["ASSET", "LIABILITY", "CAPITAL"],
          },
        },
        orderBy: {
          id: "asc",
        },
      }),

      prisma.contact.count({
        where: {
          type: {
            in: ["CUSTOMER", "BOTH"],
          },
        },
      }),

      prisma.contact.count({
        where: {
          type: {
            in: ["VENDOR", "BOTH"],
          },
        },
      }),
    ]);

    // -----------------------------
    // BASIC TOTALS
    // -----------------------------

    const totalSales = sales.reduce(
      (sum, sale) => sum + sale.totalAmount,
      0,
    );

    const totalPurchases = purchases.reduce(
      (sum, purchase) => sum + purchase.totalAmount,
      0,
    );

    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );

    const grossProfit = totalSales - totalPurchases;

    const netProfit = grossProfit - totalExpenses;

    // -----------------------------
    // SALES BY PRODUCT
    // -----------------------------

    const salesByProductMap = {};

    for (const sale of sales) {
      const productId = sale.productId;

      if (!salesByProductMap[productId]) {
        salesByProductMap[productId] = {
          productId,
          productName: sale.product.name,
          quantity: 0,
          amount: 0,
        };
      }

      salesByProductMap[productId].quantity += sale.quantity;
      salesByProductMap[productId].amount += sale.totalAmount;
    }

    const salesByProduct = Object.values(salesByProductMap)
      .sort((a, b) => b.amount - a.amount);

    // -----------------------------
    // PURCHASES BY PRODUCT
    // -----------------------------

    const purchasesByProductMap = {};

    for (const purchase of purchases) {
      const productId = purchase.productId;

      if (!purchasesByProductMap[productId]) {
        purchasesByProductMap[productId] = {
          productId,
          productName: purchase.product.name,
          quantity: 0,
          amount: 0,
        };
      }

      purchasesByProductMap[productId].quantity += purchase.quantity;
      purchasesByProductMap[productId].amount += purchase.totalAmount;
    }

    const purchasesByProduct = Object.values(
      purchasesByProductMap,
    ).sort((a, b) => b.amount - a.amount);

    // -----------------------------
    // EXPENSES BY ACCOUNT
    // -----------------------------

    const expensesByAccountMap = {};

    for (const expense of expenses) {
      const accountId = expense.accountId;

      if (!expensesByAccountMap[accountId]) {
        expensesByAccountMap[accountId] = {
          accountId,
          accountName: expense.account.accountName,
          amount: 0,
        };
      }

      expensesByAccountMap[accountId].amount += expense.amount;
    }

    const expensesByAccount = Object.values(
      expensesByAccountMap,
    ).sort((a, b) => b.amount - a.amount);

    // -----------------------------
    // BALANCE SHEET
    // -----------------------------

    const assets = expenseAccounts.filter(
      (account) => account.accountType === "ASSET",
    );

    const liabilities = expenseAccounts.filter(
      (account) => account.accountType === "LIABILITY",
    );

    const capital = expenseAccounts.filter(
      (account) => account.accountType === "CAPITAL",
    );

    // -----------------------------
    // RESPONSE
    // -----------------------------

    res.status(200).json({
      overview: {
        totalSales,
        totalPurchases,
        totalExpenses,
        grossProfit,
        netProfit,
        customers,
        vendors,
      },

      profitAndLoss: {
        revenue: totalSales,
        costOfGoods: totalPurchases,
        grossProfit,
        operatingExpenses: totalExpenses,
        netProfit,
      },

      balanceSheet: {
        assets,
        liabilities,
        capital,
      },

      salesAnalysis: {
        transactionCount: sales.length,
        unitsSold: sales.reduce(
          (sum, sale) => sum + sale.quantity,
          0,
        ),
        byProduct: salesByProduct,
      },

      purchaseAnalysis: {
        transactionCount: purchases.length,
        unitsPurchased: purchases.reduce(
          (sum, purchase) => sum + purchase.quantity,
          0,
        ),
        byProduct: purchasesByProduct,
      },

      expenseAnalysis: {
        transactionCount: expenses.length,
        byAccount: expensesByAccount,
      },
    });
  } catch (error) {
    console.error("Error generating reports:", error);

    res.status(500).json({
      message: "Failed to generate reports",
    });
  }
};