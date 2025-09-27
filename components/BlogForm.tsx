'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Editor from './Editor'; // Import the new Editor component

interface BlogFormData {
  title: string;
  category: string;
  image: string;
  excerpt: string;
  content: string;
  author?: string;
  affiliateLink?: string;
}

interface BlogFormProps {
  onSubmit: (formData: BlogFormData) => void;
  initialData?: BlogFormData;
  categories: string[];
}

const BlogForm: React.FC<BlogFormProps> = ({ onSubmit, initialData, categories }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [content, setContent] = useState(initialData?.content || '');
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    let imageUrl = initialData?.image || '';

    if (imageFile) {
      const formData = new FormData();
      formData.append('file', imageFile);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload image');
        }

        const data = await response.json();
        imageUrl = (data.urls && data.urls.length > 0) ? data.urls[0] : '';
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image. Please try again.');
        return;
      }
    }

    const blogData: BlogFormData = {
      title: (form.elements.namedItem('title') as HTMLInputElement).value,
      content: content,
      author: (form.elements.namedItem('author') as HTMLInputElement).value,
      category: (form.elements.namedItem('category') as HTMLSelectElement).value,
      excerpt: (form.elements.namedItem('excerpt') as HTMLTextAreaElement).value,
      image: imageUrl,
      affiliateLink: (form.elements.namedItem('affiliateLink') as HTMLInputElement).value,
    };

    onSubmit(blogData);
  };

  return (
    <div className="bg-custom-surface rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-6">{initialData ? 'Edit Blog Post' : 'Add New Blog Post'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input type="text" name="title" placeholder="Title" defaultValue={initialData?.title} className="w-full bg-custom-card rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-custom-accent text-sm" />
          <input type="text" name="author" placeholder="Author" defaultValue={initialData?.author} className="w-full bg-custom-card rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-custom-accent text-sm" />
          
          <select name="category" defaultValue={initialData?.category} className="w-full bg-custom-card rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-custom-accent text-sm text-custom-text-secondary">
            <option value="">Choose a Category</option>
            {categories.map((category) => (
              <option key={category} value={category}>{
                category
              }</option>
            ))}
          </select>
          <div className="md:col-span-2">
            <label htmlFor="blog-image" className="block text-sm font-medium text-custom-text-secondary mb-2">Blog Image</label>
            <input type="file" id="blog-image" name="image" onChange={handleImageChange} className="w-full bg-custom-card rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-custom-accent text-sm" />
            {imagePreview && (
              <div className="mt-4">
                <Image src={imagePreview} alt="Blog image preview" width={200} height={200} className="rounded-lg" />
              </div>
            )}
          </div>
          <textarea name="excerpt" placeholder="Excerpt" rows={3} defaultValue={initialData?.excerpt} className="md:col-span-2 w-full bg-custom-card rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-custom-accent text-sm"></textarea>
          <input type="text" name="affiliateLink" placeholder="Affiliate Link" defaultValue={initialData?.affiliateLink} className="md:col-span-2 w-full bg-custom-card rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-custom-accent text-sm" />
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-custom-text-secondary mb-2">Content</label>
            <Editor content={content} onChange={setContent} />
          </div>
        </div>
        <div className="mt-6">
          <button type="submit" className="w-full bg-custom-accent text-white font-semibold py-3 rounded-lg hover:bg-purple-700 transition">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;