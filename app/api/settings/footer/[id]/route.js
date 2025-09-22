import connectDB from '@/lib/db';
import FooterSettings from '@/lib/models/FooterSettings';
import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
  const { id } = params;
  await connectDB();

  try {
    let settings = await FooterSettings.findOne();
    if (settings) {
      settings.gallery = settings.gallery.filter((image) => image !== id);
      settings.clientLogos = settings.clientLogos.filter((logo) => logo !== id);
      await settings.save();
    }

    return NextResponse.json({ message: 'Image deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}
