import connectDB from '@/lib/db';
import Product from '@/lib/models/Product';
import { NextResponse } from 'next/server';

export async function GET(request) {
  await connectDB();

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const department = searchParams.get('department');
    const brand = searchParams.get('brand');

    let query = {};

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Category filtering
    if (category) {
      query.category = category;
    }

    // Department filtering
    if (department) {
      query.shopDepartment = { $regex: new RegExp(`^${department}`, 'i') };
    }

    // Brand filtering
    if (brand) {
      query.brand = brand;
    }

    // Price filtering
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    let sortOptions = { createdAt: -1 }; // Default sort by newest

    // Sorting
    if (sortBy === 'priceAsc') {
      sortOptions = { price: 1 };
    } else if (sortBy === 'priceDesc') {
      sortOptions = { price: -1 };
    } else if (sortBy === 'nameAsc') {
      sortOptions = { name: 1 };
    } else if (sortBy === 'nameDesc') {
      sortOptions = { name: -1 };
    }

    const products = await Product.find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit);

    const totalProducts = await Product.countDocuments(query);

    return NextResponse.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
    }, {
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
      'Access-Control-Allow-Origin': '*'
    },
  });
}

export async function POST(request) {
  await connectDB();
  const body = await request.json();

  const product = new Product({
    name: body.name,
    description: body.description,
    shortDescription: body.shortDescription || '',
    price: body.price,
    category: body.category,
    brand: body.brand,
    shopDepartment: body.shopDepartment,
    image: body.image,
    gallery: body.gallery || [],
    rating: body.rating,
    originalPrice: body.originalPrice,
    isSale: body.isSale,
    url: body.url,
    buttons: body.buttons,
  });

  try {
    const newProduct = await product.save();
    return NextResponse.json(newProduct, {
      status: 201,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Invalid product data', error: error.message },
      { status: 400 }
    );
  }
}