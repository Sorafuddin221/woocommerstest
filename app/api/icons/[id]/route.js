
import { NextResponse } from 'next/server';
import db from '@/lib/db';
import Icon from '@/lib/models/Icon';

export async function PUT(req, { params }) {
  await db();
  const { id } = params;
  const data = await req.json();
  const updatedIcon = await Icon.findByIdAndUpdate(id, data, { new: true });
  return NextResponse.json(updatedIcon);
}

export async function DELETE(req, { params }) {
  await db();
  const { id } = params;
  await Icon.findByIdAndDelete(id);
  return NextResponse.json({ message: 'Icon deleted' });
}
