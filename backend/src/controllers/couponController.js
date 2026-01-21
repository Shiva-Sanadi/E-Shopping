const { prisma } = require("../config/db");

// ==================== COUPON MANAGEMENT ====================

exports.getAllCoupons = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;

    let where = {};
    if (search) {
      where.OR = [
        { code: { contains: search } },
        { description: { contains: search } }
      ];
    }

    const coupons = await prisma.coupon.findMany({
      where,
      skip: parseInt(skip),
      take: parseInt(limit),
      orderBy: { createdAt: "desc" }
    });

    const total = await prisma.coupon.count({ where });

    res.json({
      success: true,
      coupons,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createCoupon = async (req, res) => {
  try {
    const { code, description, discountType, discountValue, maxUses, minOrderValue, maxDiscount, startDate, expiryDate } = req.body;

    if (!code || !description || !discountType || !discountValue || !startDate || !expiryDate) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    if (!["PERCENTAGE", "FIXED"].includes(discountType)) {
      return res.status(400).json({ success: false, message: "Invalid discount type" });
    }

    if (discountType === "PERCENTAGE" && (discountValue < 0 || discountValue > 100)) {
      return res.status(400).json({ success: false, message: "Percentage must be between 0 and 100" });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        description,
        discountType,
        discountValue: parseFloat(discountValue),
        maxUses: maxUses ? parseInt(maxUses) : null,
        minOrderValue: parseFloat(minOrderValue) || 0,
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
        startDate: new Date(startDate),
        expiryDate: new Date(expiryDate)
      }
    });

    res.status(201).json({ success: true, coupon });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({ success: false, message: "Coupon code already exists" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, description, discountType, discountValue, maxUses, minOrderValue, maxDiscount, startDate, expiryDate, isActive } = req.body;

    const coupon = await prisma.coupon.update({
      where: { id: parseInt(id) },
      data: {
        ...(code && { code: code.toUpperCase() }),
        ...(description && { description }),
        ...(discountType && { discountType }),
        ...(discountValue !== undefined && { discountValue: parseFloat(discountValue) }),
        ...(maxUses !== undefined && { maxUses: maxUses ? parseInt(maxUses) : null }),
        ...(minOrderValue !== undefined && { minOrderValue: parseFloat(minOrderValue) }),
        ...(maxDiscount !== undefined && { maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(expiryDate && { expiryDate: new Date(expiryDate) }),
        ...(isActive !== undefined && { isActive })
      }
    });

    res.json({ success: true, coupon });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.coupon.delete({
      where: { id: parseInt(id) }
    });

    res.json({ success: true, message: "Coupon deleted successfully" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.validateCoupon = async (req, res) => {
  try {
    const { code, orderTotal } = req.body;

    if (!code || !orderTotal) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    // Check if coupon is active
    if (!coupon.isActive) {
      return res.status(400).json({ success: false, message: "Coupon is not active" });
    }

    // Check expiry date
    if (new Date() > coupon.expiryDate) {
      return res.status(400).json({ success: false, message: "Coupon has expired" });
    }

    // Check start date
    if (new Date() < coupon.startDate) {
      return res.status(400).json({ success: false, message: "Coupon is not yet valid" });
    }

    // Check max uses
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return res.status(400).json({ success: false, message: "Coupon usage limit reached" });
    }

    // Check minimum order value
    if (parseFloat(orderTotal) < coupon.minOrderValue) {
      return res.status(400).json({ success: false, message: `Minimum order value is ${coupon.minOrderValue}` });
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === "PERCENTAGE") {
      discountAmount = (parseFloat(orderTotal) * coupon.discountValue) / 100;
    } else {
      discountAmount = coupon.discountValue;
    }

    // Apply max discount cap if set
    if (coupon.maxDiscount) {
      discountAmount = Math.min(discountAmount, coupon.maxDiscount);
    }

    res.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: parseFloat(discountAmount.toFixed(2))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.applyCouponToOrder = async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user.id;

    if (!code) {
      return res.status(400).json({ success: false, message: "Coupon code required" });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    // Increment used count
    await prisma.coupon.update({
      where: { id: coupon.id },
      data: { usedCount: coupon.usedCount + 1 }
    });

    res.json({ success: true, coupon, message: "Coupon applied successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
