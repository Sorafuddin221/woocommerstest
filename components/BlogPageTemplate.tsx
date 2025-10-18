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