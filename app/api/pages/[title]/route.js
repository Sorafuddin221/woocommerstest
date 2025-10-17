import connectDB from '@/lib/db';
import Page from '@/lib/models/Page';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  await connectDB();
  const { title } = params;

  try {
    const page = await Page.findOne({ title });
    if (!page) {
      // If page doesn't exist, create it with empty content
      const newPage = await Page.create({ title, content: '' });
      return NextResponse.json(newPage, {
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
      });
    }
    return NextResponse.json(page, {
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  await connectDB();
  const { title } = params;
  const { content } = await request.json();

  try {
    const page = await Page.findOneAndUpdate(
      { title },
      { content },
      { new: true, upsert: true }
    );
    return NextResponse.json(page, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request) {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
