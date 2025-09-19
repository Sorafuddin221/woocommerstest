"use client"

import React, { useState, useEffect } from 'react';
import { Review } from '@/lib/interfaces';

interface ReviewsProps {
  productId: string;
  onReviewAdded: (newReview: Review) => void;
}

const Reviews: React.FC<ReviewsProps> = ({ productId, onReviewAdded }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ user: '', rating: 5, comment: '' });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reviews/${productId}`);
        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      }
    };

    fetchReviews();
  }, [productId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting review:', { ...newReview, product: productId });
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newReview, product: productId }),
      });

      console.log('Response status:', response.status);
      if (response.ok) {
        const createdReview = await response.json();
        console.log('Review created:', createdReview);
        setReviews((prev) => [...prev, createdReview]);
        setNewReview({ user: '', rating: 5, comment: '' });
        onReviewAdded(createdReview);
      } else {
        const errorData = await response.json();
        console.error('Failed to submit review:', errorData);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
      <div className="mb-6">
        {reviews.length === 0 ? (
          <p>No reviews yet. Be the first to review this product!</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="border-b py-4 flex items-start">
                <div className="w-12 h-12 rounded-full bg-gray-300 mr-4 flex-shrink-0"></div>
                <div className="flex-grow">
                    <div className="flex items-center mb-2">
                        <p className="font-bold mr-2">{review.user}</p>
                        <div className="flex">
                        {Array.from({ length: 5 }, (_, i) => (
                            <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                        ))}
                        </div>
                    </div>
                    <p className="text-gray-600 text-sm">{new Date(review.createdAt).toLocaleDateString()}</p>
                    <p className="mt-2">{review.comment}</p>
                </div>
            </div>
          ))
        )}
      </div>
      <div>
        <h3 className="text-xl font-bold mb-4">Write a Review</h3>
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="mb-4 mt-3">
                <label htmlFor="user" className="block text-sm font-medium text-gray-700">Your Name</label>
                <input
                type="text"
                id="user"
                name="user"
                value={newReview.user}
                onChange={handleInputChange}
                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
                />
            </div>
            <div className="mb-4 mt-3">
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating</label>
                <select
                id="rating"
                name="rating"
                value={newReview.rating}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                <option value={5}>5 Stars</option>
                <option value={4}>4 Stars</option>
                <option value={3}>3 Stars</option>
                <option value={2}>2 Stars</option>
                <option value={1}>1 Star</option>
                </select>
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Comment</label>
            <textarea
              id="comment"
              name="comment"
              rows={4}
              value={newReview.comment}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default Reviews;