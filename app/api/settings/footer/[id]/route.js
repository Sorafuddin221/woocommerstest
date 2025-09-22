import connectDB from '@/lib/db';
import FooterSettings from '@/lib/models/FooterSettings';
import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
  const { id } = params;
  await connectDB();

  try {
    let settings = await FooterSettings.findOne();
    if (settings) {
      // Remove from gallery
      const galleryIndex = settings.gallery.indexOf(id);
      if (galleryIndex > -1) {
        settings.gallery.splice(galleryIndex, 1);
      }

      // Remove from clientLogos
      const clientLogoIndex = settings.clientLogos.indexOf(id);
      if (clientLogoIndex > -1) {
        settings.clientLogos.splice(clientLogoIndex, 1);
      }
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
