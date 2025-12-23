const { prisma } = require("../config/db");

exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { productId: parseInt(productId) },
      include: {
        user: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedReviews = reviews.map(review => ({
      id: review.id,
      name: review.name || review.user.name,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      date: review.createdAt.toISOString()
    }));

    res.json(formattedReviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { productId, name, rating, title, comment } = req.body;

    if (!productId || !rating || !title || !comment) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const review = await prisma.review.create({
      data: {
        userId: req.user.id,
        productId,
        name: name || req.user.name,
        rating,
        title,
        comment
      }
    });

    res.status(201).json({
      success: true,
      review: {
        id: review.id,
        name: review.name,
        rating: review.rating,
        title: review.title,
        comment: review.comment,
        date: review.createdAt.toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, rating, title, comment } = req.body;

    const review = await prisma.review.findUnique({
      where: { id: parseInt(id) }
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.userId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this review" });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (rating) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
      }
      updateData.rating = rating;
    }
    if (title) updateData.title = title;
    if (comment) updateData.comment = comment;

    const updatedReview = await prisma.review.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.json({
      success: true,
      review: {
        id: updatedReview.id,
        name: updatedReview.name,
        rating: updatedReview.rating,
        title: updatedReview.title,
        comment: updatedReview.comment,
        date: updatedReview.createdAt.toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await prisma.review.findUnique({
      where: { id: parseInt(id) }
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.userId !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    await prisma.review.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: "Review deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};