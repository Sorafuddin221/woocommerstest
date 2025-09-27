import connectDB from '@/lib/db';
import BlogPost from '@/lib/models/BlogPost';
import { NextResponse } from 'next/server';
import { slugify } from '@/lib/utils'; // Import slugify

export async function GET(request) {
  await connectDB();

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '6');

    let query = {};

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    // Category filtering
    if (category) {
      query.category = category;
    }

    const blogPosts = await BlogPost.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalBlogPosts = await BlogPost.countDocuments(query);

    return NextResponse.json({
      blogPosts,
      currentPage: page,
      totalPages: Math.ceil(totalBlogPosts / limit),
      totalBlogPosts,
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  await connectDB();
  const body = await request.json();
  console.log('Creating blog post with body:', body);

  let slug = slugify(body.title);
  let existingPost = await BlogPost.findOne({ slug: slug });
  if (existingPost) {
    slug = `${slug}-${Date.now()}`;
  }

  const blogPost = new BlogPost({
    title: body.title,
    content: body.content,
    author: body.author,
    date: body.date,
    slug: slug,
    image: body.image,
    category: body.category,
    excerpt: body.excerpt,
    affiliateLink: body.affiliateLink,
  });

  try {
    const newBlogPost = await blogPost.save();
    return NextResponse.json(newBlogPost, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Invalid blog post data', error: error.message },
      { status: 400 }
    );
  }
}