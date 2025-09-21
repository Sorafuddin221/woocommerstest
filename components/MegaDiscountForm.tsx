'use client';
import React, { useState } from 'react';
import { MegaDiscountFormData } from '@/lib/interfaces';

interface MegaDiscountFormProps {
  onSubmit: (formData: MegaDiscountFormData) => void;
  initialData?: MegaDiscountFormData;
}

const MegaDiscountForm: React.FC<MegaDiscountFormProps> = ({ onSubmit, initialData }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    let imageUrl = initialData?.image || '';

    if (imageFile) {
      const uploadFormData = new FormData();
      uploadFormData.append('file', imageFile);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload`, {
          method: 'POST',
          body: uploadFormData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload file');
        }

        const data = await response.json();
        imageUrl = (data.urls && data.urls.length > 0) ? data.urls[0] : '';
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image. Please try again.');
        return;
      }
    }

    const finalFormData: MegaDiscountFormData = {
      title: (form.elements.namedItem('title') as HTMLInputElement).value,
      subtitle: (form.elements.namedItem('subtitle') as HTMLInputElement).value,
      image: imageUrl,
      buttonText: (form.elements.namedItem('buttonText') as HTMLInputElement).value,
      buttonLink: (form.elements.namedItem('buttonLink') as HTMLInputElement).value,
    };

    onSubmit(finalFormData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <form onSubmit={handleSubmit} className=''>
      <div className="mb-4">
        <label htmlFor="title" className="block text-light-700 text-sm font-bold mb-2">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          defaultValue={initialData?.title}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-light-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="subtitle" className="block text-light-700 text-sm font-bold mb-2">Subtitle:</label>
        <input
          type="text"
          id="subtitle"
          name="subtitle"
          defaultValue={initialData?.subtitle}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-light-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="image" className="block text-light-700 text-sm font-bold mb-2">Image:</label>
        <input
          type="file"
          id="image"
          name="image"
          onChange={handleFileChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-light-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {imagePreview && <img src={imagePreview} alt="Preview" className="mt-4 h-20" />}
      </div>
      <div className="mb-4">
        <label htmlFor="buttonText" className="block text-light-700 text-sm font-bold mb-2">Button Text:</label>
        <input
          type="text"
          id="buttonText"
          name="buttonText"
          defaultValue={initialData?.buttonText}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-light-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="buttonLink" className="block text-light-700 text-sm font-bold mb-2">Button Link:</label>
        <input
          type="text"
          id="buttonLink"
          name="buttonLink"
          defaultValue={initialData?.buttonLink}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-light-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Save
      </button>
    </form>
  );
};

export default MegaDiscountForm;