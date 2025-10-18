import React from 'react';
import Link from 'next/link';

interface BlogPageTemplateProps {
  title?: string;
  heroImage?: string;
  subheading?: string;
  buttonUrl?: string;
  buttons?: Array<{ text: string; url: string; regularPrice?: number; salePrice?: number }>;
  children: React.ReactNode;
}

const BlogPageTemplate: React.FC<BlogPageTemplateProps> = ({ title, heroImage, subheading, buttonUrl, buttons, children }) => {
  return (
    <div className="bg-gray-100 antialiased">

      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${heroImage ? (heroImage.startsWith('http') ? heroImage : `${process.env.NEXT_PUBLIC_BACKEND_URL}${heroImage}`) : '/img/balck-wall-and-red-coffee-bad-design-in-bad-room.jpg'}')`,
          height: '50vh',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
          <h1 className="text-5xl font-bold mb-4">{title || "Our Blog"}</h1>
          {subheading && <p className="text-xl mb-8">{subheading}</p>}
          {buttonUrl && (
            <Link href={buttonUrl} className="bg-[#f7931e] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-orange-600 transition-colors duration-200">
              Read More
            </Link>
          )}

          {/* Custom Buttons */}
          {buttons && buttons.length > 0 && (
            <div className="mt-6 space-y-4">
              {buttons.map((button, index) => (
                <div key={index} className="flex items-center justify-between py-4 px-6 border-b border-gray-200 bg-white rounded-lg shadow-md">
                  <span className="w-1/3 font-bold text-lg">{button.text}:</span>
                  <span className="w-1/3 text-center text-gray-800 font-semibold">
                    {button.regularPrice && (
                      <span className="line-through mr-2">${button.regularPrice.toFixed(2)}</span>
                    )}
                    {button.salePrice && (
                      <span className="text-red-500 font-bold">${button.salePrice.toFixed(2)}</span>
                    )}
                  </span>
                  <div className="w-1/3 flex justify-end items-center space-x-4">
                    <span className="text-green-500 font-semibold hidden md:block">In Stock</span>
                    <a href={button.url} target="_blank" rel="noopener noreferrer" className="bg-red-500 text-white font-bold py-2 px-4 rounded-md hover:bg-red-600 transition-colors duration-200">Buy Now</a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Main Page Container */}
      <div className="container mx-auto p-4 md:p-8">
        <nav className="text-sm mb-6 text-gray-600">
          <Link href="/" className="hover:underline">Home</Link> &gt; <Link href="/blog" className="hover:underline">Blog</Link>
        </nav>
        {children}
      </div>

    </div>
  );
};

export default BlogPageTemplate;