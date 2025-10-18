import React from 'react';
import Link from 'next/link';

interface BlogPageTemplateProps {
  title?: string;
  heroImage?: string;
  subheading?: string;
  buttonUrl?: string;
  children: React.ReactNode;
}

const BlogPageTemplate: React.FC<BlogPageTemplateProps> = ({ title, heroImage, subheading, buttonUrl, children }) => {
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
            <Link href={buttonUrl} className="bg-[#f7931e] text-black px-8 py-3 rounded-full text-lg font-semibold hover:bg-orange-600 transition-colors duration-200">
              Read More
            </Link>
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