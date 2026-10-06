import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      min: [0, 'Price must be positive'],
      default: 0,
    },
    category: {
      type: String,
      required: [true, 'Please provide product category'],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'Please provide product brand'],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, 'Please provide product stock count'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    imageUrl: {
      type: String,
      required: [true, 'Please provide product image URL'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    specs: {
      type: Map,
      of: String,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Add index for search
productSchema.index({ name: 'text', description: 'text', brand: 'text', category: 'text' });

const Product = mongoose.model('Product', productSchema);
export default Product;
