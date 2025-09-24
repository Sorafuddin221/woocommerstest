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

    // Update fields explicitly
    if (body.newsletterText !== undefined) {
      settings.newsletterText = body.newsletterText;
    }
    if (body.copyrightText !== undefined) {
      settings.copyrightText = body.copyrightText;
    }

    // Handle gallery images
    if (body.gallery !== undefined) {
      // Filter out nulls and empty strings from the incoming array
      settings.gallery = body.gallery.filter(url => url !== '' && url !== null);
    }

    // Handle client logos
    if (body.clientLogos !== undefined) {
      // Filter out nulls and empty strings from the incoming array
      settings.clientLogos = body.clientLogos.filter(url => url !== '' && url !== null);
    }

    const updatedSettings = await settings.save();
    return NextResponse.json(updatedSettings);
}