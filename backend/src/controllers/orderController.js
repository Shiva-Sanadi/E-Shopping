const { prisma } = require("../config/db");

const generateOrderNumber = () => {
  return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

exports.createOrder = async (req, res) => {
  try {
    const { 
      products, 
      shippingAddress, 
      shippingCity, 
      shippingZip, 
      paymentMethod,
      totalPrice 
    } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "No products in order" });
    }

    if (!shippingAddress || !shippingCity || !shippingZip) {
      return res.status(400).json({ message: "Shipping information required" });
    }

    // Create order with items
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: req.user.id,
        totalPrice: parseFloat(totalPrice),
        shippingAddress,
        shippingCity,
        shippingZip,
        paymentMethod: paymentMethod || "cod",
        status: "PENDING",
        items: {
          create: products.map(item => ({
            productId: item.id,
            quantity: item.totalQuantity,
            price: parseFloat(item.price),
            name: item.name,
            image: item.image
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    // Update product stock
    for (const item of products) {
      await prisma.product.update({
        where: { id: item.id },
        data: {
          stock: {
            decrement: item.totalQuantity
          }
        }
      });
    }

    // Clear user's cart
    await prisma.cartItem.deleteMany({
      where: { userId: req.user.id }
    });

    res.status(201).json({
      success: true,
      order: {
        orderNumber: order.orderNumber,
        totalPrice: Number(order.totalPrice),
        shippingInformation: {
          address: order.shippingAddress,
          city: order.shippingCity,
          zip: order.shippingZip
        },
        products: order.items.map(item => ({
          id: item.productId,
          name: item.name,
          price: Number(item.price),
          totalQuantity: item.quantity,
          image: item.image
        }))
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: {
          select: { name: true, email: true }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user owns this order or is admin
    if (order.userId !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status }
    });

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};