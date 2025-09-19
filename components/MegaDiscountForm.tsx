'use client';
import React, { useState } from 'react';
import { MegaDiscountFormData } from '@/lib/interfaces';

interface MegaDiscountFormProps {
  onSubmit: (formData: MegaDiscountFormData) => void;
  initialData?: MegaDiscountFormData;
}

const MegaDiscountForm: React.FC<MegaDiscountFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState(initialData || {
    title: '',
    subtitle: '',
    image: '',
    buttonText: '',
    buttonLink: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload`, {
          method: 'POST',
          body: uploadFormData,
          headers: {
            'x-filename': file.name,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to upload file');
        }

        const data = await response.json();
        setFormData((prevData) => ({ ...prevData, image: data.urls[0] }));
      } catch (error: any) {
        console.error(error);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className=''>
      <div className="mb-4">
        <label htmlFor="title" className="block text-light-700 text-sm font-bold mb-2">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
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
          value={formData.subtitle}
          onChange={handleChange}
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
        {formData.image && <img src={formData.image || '/img/placeholder.jpg'} alt="Preview" className="mt-4 h-20" />}
      </div>
      <div className="mb-4">
        <label htmlFor="buttonText" className="block text-light-700 text-sm font-bold mb-2">Button Text:</label>
        <input
          type="text"
          id="buttonText"
          name="buttonText"
          value={formData.buttonText}
          onChange={handleChange}
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
          value={formData.buttonLink}
          onChange={handleChange}
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