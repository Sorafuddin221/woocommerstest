import connectDB from '@/lib/db';
import ThemeSetting from '@/lib/models/ThemeSetting';
import { NextResponse } from 'next/server';

export async function GET(request) {
  await connectDB();

  try {
    let settings = await ThemeSetting.findOne();
    if (!settings) {
      // If no settings exist, create a default one
      settings = await ThemeSetting.create({
        headerLogoUrl: '/img/placeholder.jpg',
        metaTitle: 'My Affiliate App',
        metaDescription: 'A powerful affiliate marketing platform.',
        metaLogoUrl: '/img/placeholder.jpg',
        faviconUrl: '/img/favicon.ico',
        headerSectionText: 'Welcome to our store!',
        showSearchForm: true,
        headerLogoText: 'ffiliate',
        showHeaderLogoImage: true,
        showHeaderLogoText: true,
        showMegaDiscounts: true,
        heroSlides: [], // Initialize heroSlides as an empty array
        clientLogos: [],
        customFields: [],
      });
    return NextResponse.json(settings, {
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

export async function PUT(request) {
  await connectDB();
  const updates = await request.json();

  try {
    let settings = await ThemeSetting.findOneAndUpdate({}, updates, { new: true, upsert: true });
    return NextResponse.json(settings, {
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