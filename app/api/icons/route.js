
import { NextResponse } from 'next/server';
import db from '@/lib/db';
import Icon from '@/lib/models/Icon';

export async function GET() {
  await db();
  const icons = await Icon.find({});
  return NextResponse.json(icons);
}

export async function POST(req) {
  await db();
  const data = await req.json();
  const icon = await Icon.create(data);
  return NextResponse.json(icon);
}
