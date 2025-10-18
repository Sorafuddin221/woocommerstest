import connectDB from '@/lib/db';
import Product from '@/lib/models/Product';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  await connectDB();
  const { id } = params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  await connectDB();
  const { id } = params;
  const body = await request.json();

  try {
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    if (body.name != null) product.name = body.name;
    if (body.description != null) product.description = body.description;
    if (body.shortDescription != null) product.shortDescription = body.shortDescription;
    if (body.price != null) product.price = body.price;
    if (body.category != null) product.category = body.category;
    if (body.brand != null) product.brand = body.brand;
    if (body.shopDepartment != null) product.shopDepartment = body.shopDepartment;
    if (body.image != null) product.image = body.image;
    if (body.gallery != null) product.gallery = body.gallery;
    if (body.rating != null) product.rating = body.rating;
    if (body.originalPrice != null) product.originalPrice = body.originalPrice;
    if (body.isSale != null) product.isSale = body.isSale;
    if (body.url != null) product.url = body.url;
    if (body.buttons != null) product.buttons = body.buttons;

    const updatedProduct = await product.save();
    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  await connectDB();
  const { id } = params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    await product.deleteOne();
    return NextResponse.json({ message: 'Product deleted' });
  } catch (error) {
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}