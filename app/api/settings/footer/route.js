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
  console.log('PUT /api/settings/footer received.');
  try {
    console.log('Attempting to connect to DB...');
    await connectDB();
    console.log('DB connected.');

    console.log('Parsing request body...');
    const body = await request.json();
    console.log('Request body parsed:', body);

    console.log('Searching for existing footer settings...');
    let settings = await FooterSettings.findOne();
    if (!settings) {
      console.log('No existing settings found, initializing new FooterSettings.');
      settings = new FooterSettings(); // Initialize if not found
    } else {
      console.log('Existing settings found:', settings._id);
    }

    // Update fields explicitly
    if (body.newsletterText !== undefined) {
      settings.newsletterText = body.newsletterText;
      console.log('Updated newsletterText.');
    }
    if (body.copyrightText !== undefined) {
      settings.copyrightText = body.copyrightText;
      console.log('Updated copyrightText.');
    }

    // Handle gallery images
    if (body.gallery !== undefined) {
      settings.gallery = body.gallery.filter(url => url !== '' && url !== null);
      console.log('Updated gallery with filtered URLs. Count:', settings.gallery.length);
    }

    // Handle client logos
    if (body.clientLogos !== undefined) {
      settings.clientLogos = body.clientLogos.filter(url => url !== '' && url !== null);
      console.log('Updated clientLogos with filtered URLs. Count:', settings.clientLogos.length);
    }

    console.log('Attempting to save settings to the database...');
    const updatedSettings = await settings.save();
    console.log('Settings saved successfully:', updatedSettings._id);
    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error('Footer Settings PUT Error:', error.message);
    return NextResponse.json(
      { message: 'Server error', error: error.message || 'Failed to update footer settings' },
      { status: 500 }
    );
  }
}