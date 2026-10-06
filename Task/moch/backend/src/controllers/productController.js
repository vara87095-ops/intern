import Product from '../models/Product.js';

// @desc    Fetch all products with filtering, search, sorting & pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const pageSize = Number(req.query.limit) || 12;
    const page = Number(req.query.page) || 1;

    const query = {};

    // Search keyword by name, description, brand, or category
    if (req.query.keyword && req.query.keyword.trim() !== '') {
      const keywordRegex = {
        $regex: req.query.keyword.trim(),
        $options: 'i',
      };
      query.$or = [
        { name: keywordRegex },
        { description: keywordRegex },
        { brand: keywordRegex },
        { category: keywordRegex },
      ];
    }

    // Category filter
    if (req.query.category && req.query.category !== 'All') {
      query.category = req.query.category;
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) {
        query.price.$gte = Number(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        query.price.$lte = Number(req.query.maxPrice);
      }
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // default newest
    if (req.query.sort === 'price-asc') {
      sortOption = { price: 1 };
    } else if (req.query.sort === 'price-desc') {
      sortOption = { price: -1 };
    } else if (req.query.sort === 'rating') {
      sortOption = { rating: -1 };
    } else if (req.query.sort === 'name-asc') {
      sortOption = { name: 1 };
    }

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOption)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    return res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize) || 1,
      total: count,
    });
  } catch (error) {
    console.error('getProducts error:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch distinct product categories with item counts
// @route   GET /api/products/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const categories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const formatted = categories.map((c) => ({
      name: c._id,
      count: c.count,
    }));

    return res.json(formatted);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      return res.json(product);
    } else {
      return res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Product not found or invalid ID format' });
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      brand,
      stock,
      imageUrl,
      featured,
      specs,
    } = req.body;

    if (!name || !price || !category || !imageUrl) {
      return res.status(400).json({
        message: 'Name, price, category, and image URL are required fields',
      });
    }

    const product = new Product({
      name,
      description: description || 'High quality product designed for everyday convenience.',
      price: Number(price),
      category,
      brand: brand || 'Generic',
      stock: Number(stock) || 0,
      imageUrl,
      featured: Boolean(featured),
      specs: specs || {},
      rating: 4.8,
      numReviews: 12,
    });

    const createdProduct = await product.save();
    return res.status(201).json(createdProduct);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = req.body.name ?? product.name;
      product.description = req.body.description ?? product.description;
      product.price = req.body.price !== undefined ? Number(req.body.price) : product.price;
      product.category = req.body.category ?? product.category;
      product.brand = req.body.brand ?? product.brand;
      product.stock = req.body.stock !== undefined ? Number(req.body.stock) : product.stock;
      product.imageUrl = req.body.imageUrl ?? product.imageUrl;
      product.featured = req.body.featured !== undefined ? Boolean(req.body.featured) : product.featured;
      if (req.body.specs) {
        product.specs = req.body.specs;
      }

      const updatedProduct = await product.save();
      return res.json(updatedProduct);
    } else {
      return res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      return res.json({ message: 'Product successfully removed' });
    } else {
      return res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
