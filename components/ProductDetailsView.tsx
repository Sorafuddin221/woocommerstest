'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FacebookShareButton, TwitterShareButton, PinterestShareButton, WhatsappShareButton, FacebookIcon, TwitterIcon, PinterestIcon, WhatsappIcon } from 'react-share';
import Reviews from './Reviews';
import { Product, Review } from '@/lib/interfaces';

interface ProductDetailsViewProps {
  product: Product;
}

export default function ProductDetailsView({ product: initialProduct }: { product: Product }) {
  const [product, setProduct] = useState(initialProduct);
  const [activeTab, setActiveTab] = useState('description');
  const [mainImage, setMainImage] = useState(product.image ? (product.image.startsWith('http') ? product.image : `${process.env.NEXT_PUBLIC_BACKEND_URL}${product.image}`) : '/img/placeholder.jpg');
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  // Set initial main image when product changes
  useEffect(() => {
    setMainImage(product.image || '/img/placeholder.jpg');
  }, [product.image]);

  const handleReviewAdded = (newReview: Review) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      reviewCount: (prevProduct.reviewCount || 0) + 1,
    }));
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 flex flex-col lg:flex-row gap-8">
        {/* Product Image Gallery */}
        <div className="lg:w-1/2 flex flex-col items-center">
          <Image src={mainImage} alt={product.name || 'Product image'} width={500} height={500} className="rounded-lg shadow-md mb-4 object-contain w-full h-auto" />
          {product.gallery && product.gallery.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {product.gallery.map((imgSrc, index) => (
                <Image
                  key={index}
                  src={imgSrc}
                  alt={`${product.name} - Thumbnail ${index + 1}`}
                  width={100}
                  height={100}
                  className="rounded-lg cursor-pointer border-2 border-transparent hover:border-blue-500 transition-all duration-200 object-cover"
                  onClick={() => setMainImage(imgSrc)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="lg:w-1/2">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <p className="text-gray-600 text-sm mb-4">Category: <Link href="#" className="text-blue-600 hover:underline">{product.category}</Link></p>

          {/* Star Rating */}
          <div className="flex items-center mb-4">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className={i < product.rating ? "text-yellow-400" : "text-gray-300"}>★</span>
            ))}
            <span className="text-gray-500 text-sm ml-2">
              {product.reviewCount === 0 ? "(No reviews yet)" : `(${product.reviewCount} reviews)`}
            </span>
          </div>

          {product.isSale ? (
            <p className="text-gray-400 line-through text-xl font-medium">${product.originalPrice}</p>
          ) : null}
          <p className="text-gray-800 font-bold text-4xl mb-4">${product.price}</p>

          <div className="text-gray-700 leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: product.shortDescription || '' }} />

          {/* Custom Buttons */}
          {product.buttons && product.buttons.length > 0 && (
            <div className="mt-6 space-y-4">
              {product.buttons.map((button, index) => (
                <a
                  key={index}
                  href={button.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {button.text}
                  {button.regularPrice && (
                    <span className="ml-2 line-through opacity-75">${button.regularPrice.toFixed(2)}</span>
                  )}
                  {button.salePrice && (
                    <span className="ml-2">${button.salePrice.toFixed(2)}</span>
                  )}
                </a>
              ))}
            </div>
          )}

          {/* Social Share */}
          {shareUrl && (
            <div className="mt-8 border-t border-gray-200 pt-6">
              <span className="text-gray-700 font-semibold mr-4">Share:</span>
              <div className="flex gap-3">
                <FacebookShareButton url={shareUrl} hashtag={`#${(product.name || '').replace(/\s/g, '')}`}>
                  <FacebookIcon size={32} round />
                </FacebookShareButton>
                <TwitterShareButton url={shareUrl} title={product.name}>
                  <TwitterIcon size={32} round />
                </TwitterShareButton>
                <PinterestShareButton
                  url={shareUrl}
                  media={product.image}
                  description={product.name}
                >
                  <PinterestIcon size={32} round />
                </PinterestShareButton>
                <WhatsappShareButton url={shareUrl} title={product.name}>
                  <WhatsappIcon size={32} round />
                </WhatsappShareButton>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Description and Reviews Tabs */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6 md:p-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('description')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'description' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Description
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'reviews' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Reviews
            </button>
          </nav>
        </div>
        <div className="mt-6 text-gray-700 leading-relaxed">
          {activeTab === 'description' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Product Description</h3>
              <div className="mb-4" dangerouslySetInnerHTML={{ __html: product.description || '' }} />
            </div>
          )}
          {activeTab === 'reviews' && <Reviews productId={product._id} onReviewAdded={handleReviewAdded} />}
        </div>
      </div>

    </>
  );
}
