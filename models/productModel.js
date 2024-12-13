const mongoose = require('mongoose');

const variationSchema = new mongoose.Schema({
  size_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Sizes',
  },
  color_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Colors',
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    required: true,
  },
  colors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Colors' }],
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
},{collection:"Products"});

const Product = mongoose.model('Products', productSchema);

module.exports = Product;
