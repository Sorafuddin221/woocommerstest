
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = (file: File): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const stream = cloudinary.uploader.upload_stream({ folder: 'my-affiliatapp' }, (error, result) => {
      if (error) {
        console.error('Cloudinary Error:', error);
        return reject(new Error(error.message || 'Cloudinary upload failed'));
      }
      if (result) {
        resolve(result.secure_url);
      } else {
        reject(new Error('Cloudinary upload failed: No result received.'));
      }
    });

    try {
      stream.end(buffer);
    } catch (streamErr) {
      console.error('Stream End Error:', streamErr);
      reject(new Error('Failed to end upload stream.'));
    }
  });
};

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const singleFile = formData.get('file') as File | null;
  const galleryFiles = formData.getAll('galleryFiles') as File[];

  try {
    if (singleFile) {
      const url = await uploadToCloudinary(singleFile);
      return NextResponse.json({ success: true, urls: [url] });
    }

    if (galleryFiles.length > 0) {
      const urls = await Promise.all(galleryFiles.map(uploadToCloudinary));
      return NextResponse.json({ success: true, urls });
    }

    return NextResponse.json({ success: false, error: 'No files found' }, { status: 400 });

  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Upload failed' }, { status: 500 });
  }
}
