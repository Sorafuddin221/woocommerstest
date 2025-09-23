import connectDB from '@/lib/db';
import BlogPost from '@/lib/models/BlogPost';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  await connectDB();
  const { id } = params;

  try {
    let blogPost;
    // Check if the id is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      blogPost = await BlogPost.findById(id);
    } else {
      // If not a valid ObjectId, assume it's a slug
      blogPost = await BlogPost.findOne({ slug: id });
    }

    if (!blogPost) {
      return NextResponse.json(
        { message: 'Blog post not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(blogPost);
  } catch (error) {
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}
