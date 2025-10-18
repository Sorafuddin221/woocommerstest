// server/models/Product.js

import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
    required: false,
    default: '',
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: false, // Making brand optional for now
  },
  shopDepartment: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  gallery: {
    type: [String],
    default: [],
  },
  rating: {
    type: Number,
    default: 0,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  originalPrice: {
    type: Number,
  },
  isSale: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  url: {
    type: String,
    required: false,
  },
  buttons: [
    {
      text: { type: String, required: true },
      url: { type: String, required: true },
      regularPrice: { type: Number },
      salePrice: { type: Number },
    },
  ],
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);