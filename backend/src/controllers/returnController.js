const { prisma } = require("../config/db");

// ==================== RETURN MANAGEMENT ====================

exports.createReturn = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId, reason, notes } = req.body;

    if (!orderId || !reason) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Verify order belongs to user
    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) }
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.userId !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // Check if return already exists
    const existingReturn = await prisma.return.findFirst({
      where: { orderId: parseInt(orderId) }
    });

    if (existingReturn) {
      return res.status(400).json({ success: false, message: "Return already requested for this order" });
    }

    const returnRequest = await prisma.return.create({
      data: {
        orderId: parseInt(orderId),
        userId,
        reason,
        notes: notes || null,
        refundAmount: order.totalPrice,
        status: "REQUESTED"
      },
      include: {
        order: {
          select: { orderNumber: true, totalPrice: true }
        }
      }
    });

    res.status(201).json({ success: true, return: returnRequest, message: "Return request created successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserReturns = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const returns = await prisma.return.findMany({
      where: { userId },
      skip: parseInt(skip),
      take: parseInt(limit),
      include: {
        order: {
          select: { orderNumber: true, totalPrice: true, createdAt: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    const total = await prisma.return.count({ where: { userId } });

    res.json({
      success: true,
      returns,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getReturnDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const returnRequest = await prisma.return.findUnique({
      where: { id: parseInt(id) },
      include: {
        order: {
          select: {
            orderNumber: true,
            totalPrice: true,
            shippingAddress: true,
            shippingCity: true,
            createdAt: true,
            items: {
              include: { product: true }
            }
          }
        },
        user: {
          select: { name: true, email: true }
        }
      }
    });

    if (!returnRequest) {
      return res.status(404).json({ success: false, message: "Return not found" });
    }

    if (returnRequest.userId !== userId && req.user.role !== "ADMIN") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    res.json({ success: true, return: returnRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Get all returns
exports.getAllReturns = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    let where = {};
    if (status && status !== "all") {
      where.status = status;
    }

    const returns = await prisma.return.findMany({
      where,
      skip: parseInt(skip),
      take: parseInt(limit),
      include: {
        user: {
          select: { name: true, email: true }
        },
        order: {
          select: { orderNumber: true, totalPrice: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    const total = await prisma.return.count({ where });

    res.json({
      success: true,
      returns,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Update return status
exports.updateReturnStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: "Status required" });
    }

    if (!["REQUESTED", "APPROVED", "REJECTED", "SHIPPED", "REFUNDED"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const returnRequest = await prisma.return.update({
      where: { id: parseInt(id) },
      data: {
        status,
        ...(notes && { notes })
      },
      include: {
        user: {
          select: { name: true, email: true }
        },
        order: {
          select: { orderNumber: true }
        }
      }
    });

    res.json({ success: true, return: returnRequest, message: `Return status updated to ${status}` });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ success: false, message: "Return not found" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Process refund
exports.processRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const returnRequest = await prisma.return.update({
      where: { id: parseInt(id) },
      data: {
        status: "REFUNDED",
        ...(notes && { notes })
      },
      include: {
        order: {
          select: { orderNumber: true, totalPrice: true }
        },
        user: {
          select: { name: true, email: true }
        }
      }
    });

    res.json({ success: true, return: returnRequest, message: "Refund processed successfully" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ success: false, message: "Return not found" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Reject return
exports.rejectReturn = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const returnRequest = await prisma.return.update({
      where: { id: parseInt(id) },
      data: {
        status: "REJECTED",
        ...(notes && { notes })
      }
    });

    res.json({ success: true, return: returnRequest, message: "Return rejected" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ success: false, message: "Return not found" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};
