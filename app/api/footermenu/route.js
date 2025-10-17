import connectDB from '@/lib/db';
import FooterMenuItem from '@/lib/models/FooterMenuItem';
import { NextResponse } from 'next/server';

export async function GET(request) {
  await connectDB();

  try {
    const menuItems = await FooterMenuItem.find({}).sort({ order: 1 });
    return NextResponse.json(menuItems, {
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

export async function POST(request) {
  await connectDB();
  const { title, url, order } = await request.json();

  try {
    const menuItem = await FooterMenuItem.create({ title, url, order });
    return NextResponse.json(menuItem, {
      status: 201,
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
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
