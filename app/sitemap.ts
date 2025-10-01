import { MetadataRoute } from 'next';
import dbConnect from '@/lib/db';
import Product from '@/lib/models/Product';
import BlogPost from '@/lib/models/BlogPost';
import Category from '@/lib/models/Category';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await dbConnect();

  const siteUrl = process.env.VERCEL_URL
    ? `https://` + process.env.VERCEL_URL
    : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // 1. Static Pages
  const staticPages = [
    '',
    '/products',
    '/contact',
    '/login',
    '/blog',
    '/privacy-policy',
    '/search',
  ];

  const staticUrls = staticPages.map((page) => ({
    url: `${siteUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as 'weekly',
    priority: page === '' ? 1.0 : 0.8,
  }));

  // 2. Dynamic Product Pages
  const products = await Product.find({}).select('_id updatedAt').lean();
  const productUrls = products.map((product) => ({
    url: `${siteUrl}/product/${product._id}`,
    lastModified: product.updatedAt || new Date(),
    changeFrequency: 'daily' as 'daily',
    priority: 0.7,
  }));

  // 3. Dynamic Blog Post Pages
  const posts = await BlogPost.find({}).select('slug date').lean();
  const blogUrls = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.date || new Date(),
    changeFrequency: 'weekly' as 'weekly',
    priority: 0.6,
  }));

  // 4. Dynamic Category Pages
  const categories = await Category.find({}).select('name').lean();
  const categoryUrls = categories.map((category) => ({
    url: `${siteUrl}/shop/category/${encodeURIComponent(category.name)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as 'weekly',
    priority: 0.7,
  }));

  // 5. Dynamic Brand Pages
  const brands = await Product.distinct('brand');
  const brandUrls = brands.map((brand) => ({
    url: `${siteUrl}/shop/brand/${encodeURIComponent(brand)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as 'weekly',
    priority: 0.6,
  }));
  
  // 6. Dynamic Department Pages
  const departments = await Product.distinct('shopDepartment');
  const departmentUrls = departments.map((dept) => ({
    url: `${siteUrl}/shop/${encodeURIComponent(dept)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as 'weekly',
    priority: 0.6,
  }));


  return [
    ...staticUrls,
    ...productUrls,
    ...blogUrls,
    ...categoryUrls,
    ...brandUrls,
    ...departmentUrls,
  ];
}