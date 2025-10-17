import connectDB from '@/lib/db';
import FooterMenuItem from '@/lib/models/FooterMenuItem';
import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
  await connectDB();
  const { id } = params;

  try {
    await FooterMenuItem.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Item deleted successfully' }, {
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
      'Access-Control-Allow-Methods': 'DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
