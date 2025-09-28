'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface HeroSectionSettings {
  heading: string;
  subheading: string;
  imageUrl: string;
  buttonUrl: string;
}

interface BootcampSettings {
  productsPageHero: HeroSectionSettings;
  blogPageHero: HeroSectionSettings;
  contactPageHero: HeroSectionSettings;
}

const BootcampSettingsPage = () => {
  const [settings, setSettings] = useState<BootcampSettings>({
    productsPageHero: { heading: '', subheading: '', imageUrl: '', buttonUrl: '' },
    blogPageHero: { heading: '', subheading: '', imageUrl: '', buttonUrl: '' },
    contactPageHero: { heading: '', subheading: '', imageUrl: '', buttonUrl: '' },
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('/api/settings');
        if (response.data) {
          setSettings(response.data);
        }
      } catch (error: any) {
        toast.error('Failed to fetch settings.');
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, page: string, field: string) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [page]: {
        ...prevSettings[page as keyof typeof prevSettings],
        [field]: e.target.value,
      },
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, page: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSettings(prevSettings => ({
        ...prevSettings,
        [page]: {
          ...prevSettings[page as keyof typeof prevSettings],
          imageUrl: response.data.urls[0],
        },
      }));
      toast.success('Image uploaded successfully!');
    } catch (error: any) {
      toast.error('Image upload failed.');
      console.error('Error uploading image:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post('/api/settings', settings);
      toast.success('Settings updated successfully!');
      window.location.reload();
    } catch (error: any) {
      toast.error('Failed to update settings.');
      console.error('Error updating settings:', error);
    }
  };

  const renderHeroSectionFields = (pageName: string, pageTitle: string) => (
    <div className="mb-6 p-4 border rounded-md shadow-sm bg-white">
      <h3 className="text-lg font-semibold mb-4">{pageTitle} Hero Section</h3>
      <div className="mb-4">
        <label htmlFor={`${pageName}-heading`} className="block text-sm font-medium text-gray-700">Heading</label>
        <input
          type="text"
          id={`${pageName}-heading`}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          value={settings[pageName as keyof typeof settings].heading}
          onChange={(e) => handleChange(e, pageName, 'heading')}
        />
      </div>
      <div className="mb-4">
        <label htmlFor={`${pageName}-subheading`} className="block text-sm font-medium text-gray-700">Subheading</label>
        <input
          type="text"
          id={`${pageName}-subheading`}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          value={settings[pageName as keyof typeof settings].subheading}
          onChange={(e) => handleChange(e, pageName, 'subheading')}
        />
      </div>
      <div className="mb-4">
        <label htmlFor={`${pageName}-imageUrl`} className="block text-sm font-medium text-gray-700">Image URL</label>
        <input
          type="text"
          id={`${pageName}-imageUrl`}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          value={settings[pageName as keyof typeof settings].imageUrl}
          onChange={(e) => handleChange(e, pageName, 'imageUrl')}
        />
        <input
          type="file"
          className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          onChange={(e) => handleImageUpload(e, pageName)}
        />
        {settings[pageName as keyof typeof settings].imageUrl && (
          <div className="mt-2">
            <img src={settings[pageName as keyof typeof settings].imageUrl} alt="Hero Image" className="max-w-xs h-auto rounded-md" />
          </div>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor={`${pageName}-buttonUrl`} className="block text-sm font-medium text-gray-700">Button URL</label>
        <input
          type="text"
          id={`${pageName}-buttonUrl`}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          value={settings[pageName as keyof typeof settings].buttonUrl}
          onChange={(e) => handleChange(e, pageName, 'buttonUrl')}
        />
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Bootcamp Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {renderHeroSectionFields('productsPageHero', 'Products Page')}
        {renderHeroSectionFields('blogPageHero', 'Blog Page')}
        {renderHeroSectionFields('contactPageHero', 'Contact Page')}
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
};

export default BootcampSettingsPage;