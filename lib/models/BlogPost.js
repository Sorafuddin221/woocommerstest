// server/models/BlogPost.js

import mongoose from 'mongoose';

const BlogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
  },
  category: {
    type: String,
  },
  excerpt: {
    type: String,
  },
});

export default mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);