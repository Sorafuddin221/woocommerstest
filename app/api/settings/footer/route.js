import connectDB from '@/lib/db';
import FooterSettings from '@/lib/models/FooterSettings';
import { NextResponse } from 'next/server';

export async function GET(request) {
  await connectDB();

  try {
    const settings = await FooterSettings.findOne();
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  await connectDB();
  const body = await request.json();

  try {
    let settings = await FooterSettings.findOne();
    if (!settings) {
      settings = new FooterSettings(); // Initialize if not found
    }

    // Filter out empty strings from gallery and clientLogos arrays
    if (body.gallery) {
      body.gallery = body.gallery.filter(url => url !== '' && url !== null);
    }
    if (body.clientLogos) {
      body.clientLogos = body.clientLogos.filter(url => url !== '' && url !== null);
    }

    settings.set(body);
    const updatedSettings = await settings.save();
    return NextResponse.json(updatedSettings);
  } catch (error) {
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}