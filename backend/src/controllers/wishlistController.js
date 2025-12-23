const { prisma } = require("../config/db");

exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await prisma.wishlist.findMany({
      where: { userId: req.user.id },
      include: {
        product: {
          include: {
            reviews: {
              select: { rating: true }
            }
          }
        }
      },
      orderBy: { addedAt: 'desc' }
    });

    const items = wishlist.map(item => {
      const ratings = item.product.reviews;
      const avgRating = ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : 0;

      return {
        id: item.product.id,
        title: item.product.title,
        price: Number(item.product.price),
        description: item.product.description,
        category: item.product.category,
        image: item.product.image,
        rating: {
          rate: Number(avgRating.toFixed(1)),
          count: ratings.length
        }
      };
    });

    res.json({ items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    console.log('Adding to wishlist:', { userId: req.user.id, productId }); // Debug

    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if already exists first
    const existing = await prisma.wishlist.findFirst({
      where: {
        userId: req.user.id,
        productId: productId
      }
    });

    if (existing) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    // Create wishlist item
    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId: req.user.id,
        productId: productId
      }
    });

    res.status(201).json({
      success: true,
      message: "Added to wishlist",
      item: wishlistItem
    });
  } catch (error) {
    console.error("Add to wishlist error:", error);
    
    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        success: false,
        message: "Product already in wishlist" 
      });
    }
    
    res.status(500).json({ message: error.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    // Find the wishlist item
    const wishlistItem = await prisma.wishlist.findFirst({
      where: {
        userId: req.user.id,
        productId: parseInt(productId)
      }
    });

    if (!wishlistItem) {
      return res.status(404).json({ message: "Item not found in wishlist" });
    }

    // Delete using the id
    await prisma.wishlist.delete({
      where: {
        id: wishlistItem.id
      }
    });

    res.json({
      success: true,
      message: "Removed from wishlist"
    });
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.clearWishlist = async (req, res) => {
  try {
    await prisma.wishlist.deleteMany({
      where: { userId: req.user.id }
    });

    res.json({
      success: true,
      message: "Wishlist cleared"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};