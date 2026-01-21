const { prisma } = require("../config/db");

// ==================== ADMIN SETTINGS ====================

exports.getSettings = async (req, res) => {
  try {
    let settings = await prisma.adminSettings.findFirst();

    // Create default settings if none exist
    if (!settings) {
      settings = await prisma.adminSettings.create({
        data: {
          businessName: "E-Shopping",
          businessEmail: "admin@eshopping.com",
          businessPhone: "",
          businessAddress: "",
          taxRate: 0,
          shippingCost: 0,
          currency: "USD"
        }
      });
    }

    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const {
      businessName,
      businessEmail,
      businessPhone,
      businessAddress,
      logo,
      taxRate,
      shippingCost,
      currency,
      autoConfirmOrder
    } = req.body;

    // Get or create settings
    let settings = await prisma.adminSettings.findFirst();

    if (!settings) {
      settings = await prisma.adminSettings.create({
        data: {
          businessName: businessName || "E-Shopping",
          businessEmail: businessEmail || "admin@eshopping.com",
          businessPhone: businessPhone || "",
          businessAddress: businessAddress || "",
          logo: logo || null,
          taxRate: taxRate ? parseFloat(taxRate) : 0,
          shippingCost: shippingCost ? parseFloat(shippingCost) : 0,
          currency: currency || "USD",
          autoConfirmOrder: autoConfirmOrder || false
        }
      });
    } else {
      settings = await prisma.adminSettings.update({
        where: { id: settings.id },
        data: {
          ...(businessName && { businessName }),
          ...(businessEmail && { businessEmail }),
          ...(businessPhone !== undefined && { businessPhone }),
          ...(businessAddress !== undefined && { businessAddress }),
          ...(logo !== undefined && { logo }),
          ...(taxRate !== undefined && { taxRate: parseFloat(taxRate) }),
          ...(shippingCost !== undefined && { shippingCost: parseFloat(shippingCost) }),
          ...(currency && { currency }),
          ...(autoConfirmOrder !== undefined && { autoConfirmOrder })
        }
      });
    }

    res.json({ success: true, settings, message: "Settings updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== ADMIN ANALYTICS ====================

exports.getAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      };
    }

    // Get revenue data
    const revenueData = await prisma.order.aggregate({
      _sum: { totalPrice: true },
      _count: true,
      where: dateFilter
    });

    // Get top selling products
    const topProducts = await prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      _count: true,
      orderBy: {
        _sum: { quantity: "desc" }
      },
      take: 10
    });

    // Get products with details
    const topProductsWithDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId }
        });
        return {
          productId: item.productId,
          title: product?.title,
          totalSold: item._sum.quantity,
          orderCount: item._count
        };
      })
    );

    // Get order status breakdown
    const orderStatusBreakdown = await prisma.order.groupBy({
      by: ["status"],
      _count: true
    });

    // Get customer growth (orders by day for last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyOrders = await prisma.order.groupBy({
      by: ["createdAt"],
      _count: true,
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    });

    // Get total users
    const totalUsers = await prisma.user.count();
    const totalProducts = await prisma.product.count();
    const totalOrders = await prisma.order.count();

    res.json({
      success: true,
      analytics: {
        revenue: {
          total: revenueData._sum.totalPrice || 0,
          ordersCount: revenueData._count
        },
        topProducts: topProductsWithDetails,
        orderStatusBreakdown,
        dailyOrders,
        summary: {
          totalUsers,
          totalProducts,
          totalOrders,
          averageOrderValue: revenueData._count > 0 ? (revenueData._sum.totalPrice / revenueData._count).toFixed(2) : 0
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;

    let where = {};

    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: {
          select: { name: true, email: true }
        },
        items: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    // Calculate summary
    const summary = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + parseFloat(order.totalPrice), 0),
      averageOrderValue: orders.length > 0 ? (orders.reduce((sum, order) => sum + parseFloat(order.totalPrice), 0) / orders.length).toFixed(2) : 0,
      uniqueCustomers: [...new Set(orders.map(o => o.userId))].length
    };

    res.json({
      success: true,
      report: {
        summary,
        orders
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
