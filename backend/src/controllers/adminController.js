const { prisma } = require("../config/db");

// ==================== DASHBOARD ====================
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalProducts = await prisma.product.count();
    const totalOrders = await prisma.order.count();
    const totalRevenue = await prisma.order.aggregate({
      _sum: { totalPrice: true }
    });

    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } }
      }
    });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue._sum.totalPrice || 0,
        recentOrders
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== PRODUCT MANAGEMENT ====================
exports.getAllProductsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;

    let where = {};
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { category: { contains: search } }
      ];
    }

    const products = await prisma.product.findMany({
      where,
      skip: parseInt(skip),
      take: parseInt(limit),
      orderBy: { createdAt: "desc" }
    });

    const total = await prisma.product.count({ where });

    res.json({
      success: true,
      products,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, stock, category, image, categoryId } = req.body;

    if (!title || !description || !price || !category) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const product = await prisma.product.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        stock: parseInt(stock) || 0,
        category,
        image: image || "/placeholder.png",
        categoryId: categoryId ? parseInt(categoryId) : null
      }
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, stock, category, image, categoryId } = req.body;

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(price && { price: parseFloat(price) }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...(category && { category }),
        ...(image && { image }),
        ...(categoryId && { categoryId: parseInt(categoryId) })
      }
    });

    res.json({ success: true, product });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id: parseInt(id) }
    });

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== USER MANAGEMENT ====================
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;

    let where = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } }
      ];
    }

    const users = await prisma.user.findMany({
      where,
      skip: parseInt(skip),
      take: parseInt(limit),
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      },
      orderBy: { createdAt: "desc" }
    });

    const total = await prisma.user.count({ where });

    res.json({
      success: true,
      users,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["USER", "ADMIN"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { role },
      select: { id: true, name: true, email: true, role: true }
    });

    res.json({ success: true, user });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id: parseInt(id) }
    });

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== ORDER MANAGEMENT ====================
exports.getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    let where = {};
    if (status && status !== "all") {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      where,
      skip: parseInt(skip),
      take: parseInt(limit),
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    const total = await prisma.order.count({ where });

    res.json({
      success: true,
      orders,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: true,
        items: { include: { product: true } }
      }
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["PENDING", "COMPLETED", "CANCELLED"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: true } }
      }
    });

    res.json({ success: true, order });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.order.delete({
      where: { id: parseInt(id) }
    });

    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};
