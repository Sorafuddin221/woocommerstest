import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/lib/models/Order';

export async function POST(req) {
  await dbConnect();

  try {
    const { orderId, paymentStatus, paymentIntentId } = await req.json();

    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    order.isPaid = paymentStatus === 'paid';
    order.paidAt = paymentStatus === 'paid' ? Date.now() : order.paidAt;
    order.paymentResult = {
      id: paymentIntentId,
      status: paymentStatus,
      update_time: Date.now().toString(),
      email_address: '', // This could be populated from Stripe webhook data
    };

    const updatedOrder = await order.save();
    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error('Error updating order payment status:', error);
    return NextResponse.json({ message: 'Error updating order payment status', error: error.message }, { status: 500 });
  }
}
