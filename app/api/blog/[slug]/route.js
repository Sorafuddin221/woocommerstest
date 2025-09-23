import connectDB from '@/lib/db';
import BlogPost from '@/lib/models/BlogPost';
import { NextResponse } from 'next/server';
import { slugify } from '@/lib/utils'; // Import slugify

export async function GET(request, { params }) {
  const { slug } = params;

  try {
    await connectDB();
    const blogPost = await BlogPost.findOne({ slug });
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

export async function PUT(request, { params }) {
  const { slug } = params;
  const body = await request.json();

  try {
    await connectDB();
    const blogPost = await BlogPost.findOne({ slug });
    if (!blogPost) {
      return NextResponse.json(
        { message: 'Blog post not found' },
        { status: 404 }
      );
    }

    if (body.title != null) {
      blogPost.title = body.title;
      let newSlug = slugify(body.title);
      let existingPost = await BlogPost.findOne({ slug: newSlug });
      if (existingPost && existingPost._id.toString() !== blogPost._id.toString()) {
        newSlug = `${newSlug}-${Date.now()}`;
      }
      blogPost.slug = newSlug;
    }

    if (body.content != null) blogPost.content = body.content;
    if (body.author != null) blogPost.author = body.author;
    if (body.date != null) blogPost.date = body.date;
    if (body.image != null) blogPost.image = body.image;
    if (body.category != null) blogPost.category = body.category;
    if (body.excerpt != null) blogPost.excerpt = body.excerpt;

    const updatedBlogPost = await blogPost.save();
    return NextResponse.json(updatedBlogPost);
  } catch (error) {
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { slug } = params;

  try {
    await connectDB();
    const blogPost = await BlogPost.findOne({ slug });
    if (!blogPost) {
      return NextResponse.json(
        { message: 'Blog post not found' },
        { status: 404 }
      );
    }

    await blogPost.deleteOne();
    return NextResponse.json({ message: 'Blog post deleted' });
  } catch (error) {
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}
