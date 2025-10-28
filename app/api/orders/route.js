import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/lib/models/Order';
import Product from '@/lib/models/Product';

export async function GET() {
  await dbConnect();
  try {
    const orders = await Order.find({}).populate('orderItems.product');
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ message: 'Error fetching orders', error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();

  try {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice } = await req.json();

    if (!orderItems || orderItems.length === 0) {
      return NextResponse.json({ message: 'No order items' }, { status: 400 });
    }

    // Check product stock and update it
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return NextResponse.json({ message: `Product ${item.name} not found` }, { status: 404 });
      }
      if (product.stock < item.quantity) {
        return NextResponse.json({ message: `Not enough stock for ${item.name}` }, { status: 400 });
      }
      product.stock -= item.quantity;
      await product.save();
    }

    const newOrder = new Order({
      orderItems: orderItems.map((x) => ({
        ...x,
        product: x.product,
      })),
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      // user: req.user._id, // Uncomment and implement user authentication if needed
    });

    const order = await newOrder.save();
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ message: 'Error creating order', error: error.message }, { status: 500 });
  }
}
