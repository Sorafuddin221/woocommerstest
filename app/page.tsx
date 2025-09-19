"use client"

import { useEffect, useState } from 'react';
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import IconSection from "../components/IconSection";
import TopCategories from "../components/TopCategories";
import MegaDiscounts from "../components/MegaDiscounts";
import BannersClients from "../components/BannersClients";
import HandpickedItems from "../components/HandpickedItems";
import NewArrivals from "../components/NewArrivals"; // Renamed component
import ShopDepartmentProducts from "../components/ShopDepartmentProducts";
import BlogPosts from "../components/BlogPosts";
import { BlogPost } from '@/lib/interfaces';
import { Product } from '@/lib/interfaces';


import Footer from "../components/Footer";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [topViewedProducts, setTopViewedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data: { products: Product[]; currentPage: number; totalPages: number; totalProducts: number } = await response.json();
        setProducts(data.products);
      } catch (error: any) {
        console.error('Error fetching products:', error);
      }
    };

    const fetchNewArrivals = async () => {
      try {
        console.log('Fetching new arrivals...');
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/new-arrivals`);
        console.log('New Arrivals response OK:', response.ok);
        if (!response.ok) {
          throw new Error('Failed to fetch new arrivals');
        }
        const data = await response.json();
        console.log('New Arrivals API response data:', data);
        setNewArrivals(data);
      } catch (error: any) {
        console.error('Error fetching new arrivals:', error);
      }
    };

    const fetchBlogPosts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blog/recent`); // Fetch only recent blog posts
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        const data = await response.json();
        setBlogPosts(data);
      } catch (error: any) {
        console.error('Error fetching blog posts:', error);
      }
    };

    const fetchTopViewedProducts = async () => {
      try {
        console.log('Fetching top viewed products...');
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/top-viewed`);
        console.log('Top Viewed Products response OK:', response.ok);
        if (!response.ok) {
          console.error('Failed to fetch top viewed products:', response.status, response.statusText);
          throw new Error('Failed to fetch top viewed products');
        }
        const data = await response.json();
        console.log('Top Viewed Products API response data:', data);
        setTopViewedProducts(data);
      } catch (error: any) {
        console.error('Error fetching top viewed products:', error);
      }
    };

    fetchProducts();
    fetchNewArrivals();
    fetchBlogPosts();
    fetchTopViewedProducts();
  }, []);

  return (
    <div className="bg-gray-100 antialiased">    
    <Header/>
    <HeroSection />
    <IconSection />

    <TopCategories />

    <MegaDiscounts />
    
    <BannersClients />

    
    <HandpickedItems items={topViewedProducts}/>

    <NewArrivals items={newArrivals} /> {/* Pass newArrivals to the NewArrivals component */}

        {products && products.length > 0 && Array.from(new Set(products.map(p => p.shopDepartment).filter((p): p is string => !!p))).map(department => (
        <ShopDepartmentProducts key={department} items={products.filter(p => p.shopDepartment === department)} departmentName={department} />
    ))}

    <BlogPosts items={blogPosts} />

    <Footer />
   </div>
)
}
