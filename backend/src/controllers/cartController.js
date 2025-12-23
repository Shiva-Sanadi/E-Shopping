const { prisma } = require("../config/db");

exports.getCart = async (req, res) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: {
        product: true
      }
    });

    const cart = {
      products: cartItems.map(item => ({
        id: item.product.id,
        name: item.product.title,
        price: Number(item.product.price),
        image: item.product.image,
        totalQuantity: item.quantity,
        totalPrice: Number(item.product.price) * item.quantity
      })),
      totalQuantity: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: cartItems.reduce((sum, item) => 
        sum + (Number(item.product.price) * item.quantity), 0
      )
    };

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    console.log('Adding to cart:', { userId: req.user.id, productId, quantity }); // Debug

    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    // Use upsert to handle duplicate entries
    const cartItem = await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId: req.user.id,
          productId: productId
        }
      },
      update: {
        quantity: {
          increment: quantity
        }
      },
      create: {
        userId: req.user.id,
        productId: productId,
        quantity: quantity
      },
      include: {
        product: true
      }
    });

    res.status(201).json({
      success: true,
      cartItem: {
        id: cartItem.product.id,
        name: cartItem.product.title,
        price: Number(cartItem.product.price),
        image: cartItem.product.image,
        totalQuantity: cartItem.quantity
      }
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) }
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    // Find the cart item
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        userId: req.user.id,
        productId: parseInt(productId)
      }
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Update using the id
    const updatedItem = await prisma.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity },
      include: { product: true }
    });

    res.json({
      success: true,
      cartItem: updatedItem
    });
  } catch (error) {
    console.error("Update cart error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    // Find the cart item
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        userId: req.user.id,
        productId: parseInt(productId)
      }
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Delete using the id
    await prisma.cartItem.delete({
      where: { id: cartItem.id }
    });

    res.json({
      success: true,
      message: "Item removed from cart"
    });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    await prisma.cartItem.deleteMany({
      where: { userId: req.user.id }
    });

    res.json({
      success: true,
      message: "Cart cleared"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};