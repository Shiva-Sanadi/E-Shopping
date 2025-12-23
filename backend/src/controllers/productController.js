const { prisma } = require("../config/db");

exports.getAllProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, sort } = req.query;
    
    let where = {};
    
    if (category && category !== "all") {
      where.category = category;
    }
    
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    let orderBy = {};
    if (sort === "price-low") orderBy.price = "asc";
    else if (sort === "price-high") orderBy.price = "desc";
    else if (sort === "name") orderBy.title = "asc";
    else orderBy.createdAt = "desc";

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        reviews: {
          select: { rating: true }
        }
      }
    });

    const productsWithRating = products.map(product => {
      const ratings = product.reviews;
      const avgRating = ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : 0;

      return {
        id: product.id,
        title: product.title,
        price: Number(product.price),
        description: product.description,
        category: product.category,
        image: product.image,
        stock: product.stock,
        rating: {
          rate: Number(avgRating.toFixed(1)),
          count: ratings.length
        }
      };
    });

    res.json(productsWithRating);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('Getting product with ID:', id); // Debug log
    
    // Validate id exists and is a valid number
    if (!id || id === 'undefined' || id === 'null') {
      console.error('Invalid ID received:', id);
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      console.error('ID is not a number:', id);
      return res.status(400).json({ message: "Product ID must be a number" });
    }

    const product = await prisma.product.findUnique({
      where: { id: parsedId },
      include: {
        reviews: {
          select: { rating: true }
        }
      }
    });

    if (!product) {
      console.log('Product not found:', parsedId);
      return res.status(404).json({ message: "Product not found" });
    }

    const ratings = product.reviews;
    const avgRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0;

    const productData = {
      id: product.id,
      title: product.title,
      price: Number(product.price),
      description: product.description,
      category: product.category,
      image: product.image,
      stock: product.stock,
      rating: {
        rate: Number(avgRating.toFixed(1)),
        count: ratings.length
      }
    };

    res.json(productData);
  } catch (error) {
    console.error("Get product by ID error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { title, price, description, category, stock } = req.body;
    const image = req.file ? `http://localhost:8000/uploads/${req.file.filename}` : "";

    if (!title || !price || !category) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const product = await prisma.product.create({
      data: {
        title,
        price: parseFloat(price),
        description: description || "",
        category,
        image,
        stock: parseInt(stock) || 0
      }
    });

    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, price, description, category, stock } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (price) updateData.price = parseFloat(price);
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (stock) updateData.stock = parseInt(stock);
    if (req.file) updateData.image = `http://localhost:8000/uploads/${req.file.filename}`;

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const products = await prisma.product.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { category: { contains: q, mode: 'insensitive' } }
        ]
      },
      include: {
        reviews: {
          select: { rating: true }
        }
      }
    });

    const productsWithRating = products.map(product => {
      const ratings = product.reviews;
      const avgRating = ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : 0;

      return {
        id: product.id,
        title: product.title,
        price: Number(product.price),
        description: product.description,
        category: product.category,
        image: product.image,
        rating: {
          rate: Number(avgRating.toFixed(1)),
          count: ratings.length
        }
      };
    });

    res.json(productsWithRating);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};