'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { HeroSlide, ClientLogo, SocialLink, ThemeSettings } from '@/lib/interfaces';

type SectionKeys = 'general' | 'headerSection' | 'heroSection' | 'megaDiscountSection' | 'clientLogosSection';

const ThemeOptionsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<ThemeSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // State for Add/Edit Modals
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [newSlideData, setNewSlideData] = useState<Partial<HeroSlide>>({ image: '', title: '', subtitle: '', ctaButtonText: '', ctaButtonLink: '' });
  const [editingLogo, setEditingLogo] = useState<ClientLogo | null>(null);
  const [newLogoData, setNewLogoData] = useState<Partial<ClientLogo>>({ imageUrl: '', link: '' });
  const [editingSocialLink, setEditingSocialLink] = useState<SocialLink | null>(null);
  const [newSocialLinkData, setNewSocialLinkData] = useState<Partial<SocialLink>>({ platform: '', url: '' });

  // State for file handling
  const [headerLogoFile, setHeaderLogoFile] = useState<File | null>(null);
  const [headerLogoPreview, setHeaderLogoPreview] = useState<string | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const [slideFile, setSlideFile] = useState<File | null>(null);
  const [slidePreview, setSlidePreview] = useState<string | null>(null);
  const [clientLogoFile, setClientLogoFile] = useState<File | null>(null);
  const [clientLogoPreview, setClientLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/settings/theme`);
        if (!response.ok) throw new Error('Failed to fetch settings');
        const data = await response.json();
        setSettings(data);
        setHeaderLogoPreview(data.headerLogoUrl);
        setFaviconPreview(data.faviconUrl);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // Reusable Upload Function
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Image upload failed: ${errorText}`);
      }
      const data = await response.json();
      if (data.success && data.urls && data.urls.length > 0) {
        return data.urls[0];
      }
      throw new Error(data.message || 'Upload failed: No URL returned.');
    } catch (error: any) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  // Generic change handler for simple text inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setSettings((prev) => (prev ? { ...prev, [name]: type === 'checkbox' ? checked : value } : null));
  };

  // Specific handlers for each file input
  const createChangeHandler = (setFile: (file: File) => void, setPreview: (url: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleHeaderLogoChange = createChangeHandler(setHeaderLogoFile, setHeaderLogoPreview);
  const handleFaviconChange = createChangeHandler(setFaviconFile, setFaviconPreview);
  const handleSlideFileChange = createChangeHandler(setSlideFile, setSlidePreview);
  const handleClientLogoFileChange = createChangeHandler(setClientLogoFile, setClientLogoPreview);

  // Handlers for slide text inputs
  const handleSlideChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editingSlide) {
      setEditingSlide((prev) => (prev ? { ...prev, [name]: value } : null));
    } else {
      setNewSlideData((prev) => ({ ...prev, [name]: value }));
    }
  };



  const handleEditSlide = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setSlidePreview(slide.image);
    setNewSlideData({}); // Clear new slide form
  };

  // Similar handlers for Client Logos
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingLogo) {
      setEditingLogo((prev) => (prev ? { ...prev, [name]: value } : null));
    } else {
      setNewLogoData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddLogo = async () => {
    if (!settings) return;
    let imageUrl = newLogoData.imageUrl || '';
    try {
      if (clientLogoFile) {
        imageUrl = await uploadImage(clientLogoFile);
      }
      const logoToAdd: ClientLogo = { ...newLogoData, imageUrl: imageUrl };
      setSettings((prev) => (prev ? { ...prev, clientLogos: [...(prev.clientLogos || []), logoToAdd] } : null));
      setNewLogoData({ imageUrl: '', link: '' });
      setClientLogoFile(null);
      setClientLogoPreview(null);
    } catch (err: any) {
      alert(`Error adding logo: ${err.message}`);
    }
  };

  const handleUpdateLogo = async () => {
    if (!settings || !editingLogo) return;
    let imageUrl = editingLogo.imageUrl;
    try {
      if (clientLogoFile) {
        imageUrl = await uploadImage(clientLogoFile);
      }
      const updatedLogo = { ...editingLogo, imageUrl };
      setSettings((prev) =>
        prev ? { ...prev, clientLogos: (prev.clientLogos || []).map((l) => (l._id === updatedLogo._id ? updatedLogo : l)) } : null
      );
      setEditingLogo(null);
      setClientLogoFile(null);
      setClientLogoPreview(null);
    } catch (err: any) {
      alert(`Error updating logo: ${err.message}`);
    }
  };

  const handleEditLogo = (logo: ClientLogo) => {
    setEditingLogo(logo);
    setClientLogoPreview(logo.imageUrl);
    setNewLogoData({}); // Clear new logo form
  };

  // Main form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!settings) return;

    console.log('Submitting theme settings...');

    const updatedSettings = { ...settings };

    try {
      console.log('Checking for header logo file...', headerLogoFile);
      if (headerLogoFile) {
        try {
          console.log('Uploading header logo...');
          updatedSettings.headerLogoUrl = await uploadImage(headerLogoFile);
          console.log('Header logo uploaded, URL:', updatedSettings.headerLogoUrl);
        } catch (uploadError: any) {
          setUploadError(uploadError.message);
          return;
        }
      }

      console.log('Checking for favicon file...', faviconFile);
      if (faviconFile) {
        try {
          console.log('Uploading favicon...');
          updatedSettings.faviconUrl = await uploadImage(faviconFile);
          console.log('Favicon uploaded, URL:', updatedSettings.faviconUrl);
        } catch (uploadError: any) {
          setUploadError(uploadError.message);
          return;
        }
      }

      if (slideFile) {
        try {
          const imageUrl = await uploadImage(slideFile);
          if (editingSlide) {
            const updatedSlide = { ...editingSlide, image: imageUrl };
            updatedSettings.heroSlides = (updatedSettings.heroSlides || []).map((s) =>
              s._id === updatedSlide._id ? updatedSlide : s
            );
          } else {
            const slideToAdd = {
              image: imageUrl,
              title: newSlideData.title || '',
              subtitle: newSlideData.subtitle || '',
              ctaButtonText: newSlideData.ctaButtonText || '',
              ctaButtonLink: newSlideData.ctaButtonLink || '',
            };
            updatedSettings.heroSlides = [...(updatedSettings.heroSlides || []), slideToAdd];
          }
        } catch (uploadError: any) {
          setUploadError(uploadError.message);
          return;
        }
      }

      console.log('Sending PUT request to /api/settings/theme with settings:', updatedSettings);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/settings/theme`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings),
      });

      const data = await response.json();
      console.log('PUT request response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save settings');
      }

      setSettings(updatedSettings);
      setHeaderLogoFile(null);
      setFaviconFile(null);
      setSlideFile(null);
      setSlidePreview(null);
      setEditingSlide(null);
      setNewSlideData({ image: '', title: '', subtitle: '', ctaButtonText: '', ctaButtonLink: '' });
      alert('Theme settings saved!');
    } catch (err: any) {
      setError(err.message);
      console.error('Error saving settings:', err);
      alert(`Error saving settings: ${err.message}`);
    }
  };

  // Delete handlers remain the same...
  const handleDeleteSlide = (id: string) => {
    if (settings && confirm('Are you sure you want to delete this slide?')) {
      setSettings((prev) =>
        prev ? { ...prev, heroSlides: (prev.heroSlides || []).filter((slide) => slide._id !== id) } : null
      );
    }
  };

  const handleDeleteLogo = async (id: string) => {
    if (settings && confirm('Are you sure you want to delete this logo?')) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/settings/theme/logos/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete logo');
        }

        setSettings((prev) =>
          prev
            ? {
                ...prev,
                clientLogos: (prev.clientLogos || []).filter((logo) => logo._id !== id),
              }
            : null
        );
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!settings) return <p>No settings found.</p>;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!settings) return <p>No settings found.</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Theme Options</h1>

      <div className="mb-6 bg-custom-surface rounded-lg p-6">
        <div className="flex border-b border-gray-200">
        <button
            type="button"
            className={`py-2 px-4 text-sm font-medium ${activeTab === 'general' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-light-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('general')}
          >
            General Settings
          </button>
          <button
            type="button"
            className={`py-2 px-4 text-sm font-medium ${activeTab === 'header' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-light-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('header')}
          >
            Header Section
          </button>
          <button
            type="button"
            className={`py-2 px-4 text-sm font-medium ${activeTab === 'hero' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-light-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('hero')}
          >
            Hero Slider
          </button>
          <button
            type="button"
            className={`py-2 px-4 text-sm font-medium ${activeTab === 'megaDiscount' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-light-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('megaDiscount')}
          >
            Mega Discount
          </button>
          <button
            type="button"
            className={`py-2 px-4 text-sm font-medium ${activeTab === 'clientLogos' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-light-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('clientLogos')}
          >
            Client Logos
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-custom-surface rounded-lg p-6 shadow-md rounded px-8 pt-6 pb-8 mb-4">
      {activeTab === 'general' && (
          <>
            <h2 className="text-2xl font-bold mb-4">General Settings</h2>
            <div className="mb-4">
              <label htmlFor="metaTitle" className="block text-light-700 text-sm font-bold mb-2">Site Title:</label>
              <input
                type="text"
                id="metaTitle"
                name="metaTitle"
                value={settings.metaTitle}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-light-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="metaDescription" className="block text-light-700 text-sm font-bold mb-2">Site Tagline:</label>
              <input
                type="text"
                id="metaDescription"
                name="metaDescription"
                value={settings.metaDescription}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-light-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="faviconUrl" className="block text-light-700 text-sm font-bold mb-2">Favicon:</label>
              <input
                type="file"
                id="faviconUrl"
                name="faviconUrl"
                onChange={handleFaviconChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-light-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              {faviconPreview && <img src={faviconPreview} alt="Favicon" className="mt-4 h-10 w-10" />}
            </div>
          </>
        )}

        {activeTab === 'header' && (
          <>
            <h2 className="text-2xl font-bold mb-4">Header Section Settings</h2>
            <div className="mb-4">
              <label htmlFor="headerLogoUrl" className="block text-light-700 text-sm font-bold mb-2">Logo Image:</label>
              <input
                type="file"
                id="headerLogoUrl"
                name="headerLogoUrl"
                onChange={handleHeaderLogoChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-light-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              {headerLogoPreview ? (
                <img src={headerLogoPreview} alt="Header Logo" className="mt-4 h-20" />
              ) : settings.headerLogoUrl && (
                <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${settings.headerLogoUrl}`} alt="Header Logo" className="mt-4 h-20" />
              )}
              {uploadError && <p className="text-red-500 text-xs italic">{uploadError}</p>}
              <p className="text-gray-600 text-xs italic mt-2">If the image is not updating, please check your Cloudinary credentials in the .env.local file.</p>
            </div>
            <div className="mb-4 ">
              <label htmlFor="headerLogoText" className="block text-light-700 text-sm font-bold mb-2">Logo Text:</label>
              <input
                type="text"
                id="headerLogoText"
                name="headerLogoText"
                value={settings.headerLogoText}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-light-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-6 flex items-center">
              <input
                type="checkbox"
                id="showHeaderLogoImage"
                name="showHeaderLogoImage"
                checked={settings.showHeaderLogoImage}
                onChange={handleChange}
                className="mr-2 leading-tight"
              />
              <label htmlFor="showHeaderLogoImage" className="block text-light-700 text-sm font-bold">Show Logo Image</label>
            </div>
            <div className="mb-6 flex items-center">
              <input
                type="checkbox"
                id="showHeaderLogoText"
                name="showHeaderLogoText"
                checked={settings.showHeaderLogoText}
                onChange={handleChange}
                className="mr-2 leading-tight"
              />
              <label htmlFor="showHeaderLogoText" className="block text-light-700 text-sm font-bold">Show Logo Text</label>
            </div>
          </>
        )}

        {activeTab === 'hero' && (
          <>
            <h2 className="text-2xl font-bold mb-4">Hero Slider Settings</h2>
            <div className="mb-6 ">
              <h3 className="text-xl font-semibold mb-4">Existing Slides</h3>
              {settings.heroSlides && settings.heroSlides.length === 0 ? (
                <p>No slides added yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {settings.heroSlides && settings.heroSlides.map((slide, index) => (
                    <div key={slide._id || index} className="border p-4 rounded-lg flex items-center justify-between">
                      <div className="flex items-center">
                        {slide.image && <Image src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${slide.image}`} alt={slide.title} width={50} height={50} className="mr-4 rounded" />}
                        <span>{slide.title}</span>
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={() => handleEditSlide(slide)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded text-sm mr-2"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSlide(slide._id!)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <h3 className="text-xl font-semibold mb-4">{editingSlide ? 'Edit Slide' : 'Add New Slide'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4 md:col-span-2 ">
                <label htmlFor="slideImage" className="block text-light-700 text-sm font-bold mb-2">Slide Image:</label>
                <input
                  type="file"
                  id="slideImage"
                  name="slideImage"
                  onChange={handleSlideFileChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-light-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {slidePreview && (
                  <Image src={slidePreview} alt="Slide Preview" width={100} height={100} className="mt-4 rounded" />
                )}
              </div>
              <div className="mb-4 ">
                <label htmlFor="slideTitle" className="block text-light-700 text-sm font-bold mb-2">Title:</label>
                <input
                  type="text"
                  id="slideTitle"
                  name="title"
                  value={editingSlide?.title || newSlideData.title || ''}
                  onChange={handleSlideChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-light-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4 ">
                <label htmlFor="slideSubtitle" className="block text-light-700 text-sm font-bold mb-2">Subtitle:</label>
                <input
                  type="text"
                  id="slideSubtitle"
                  name="subtitle"
                  value={editingSlide?.subtitle || newSlideData.subtitle || ''}
                  onChange={handleSlideChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-light-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4 ">
                <label htmlFor="slideCtaButtonText" className="block text-light-700 text-sm font-bold mb-2">CTA Button Text:</label>
                <input
                  type="text"
                  id="slideCtaButtonText"
                  name="ctaButtonText"
                  value={editingSlide?.ctaButtonText || newSlideData.ctaButtonText || ''}
                  onChange={handleSlideChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-light-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4 ">
                <label htmlFor="slideCtaButtonLink" className="block text-light-700 text-sm font-bold mb-2">CTA Button Link:</label>
                <input
                  type="text"
                  id="slideCtaButtonLink"
                  name="ctaButtonLink"
                  value={editingSlide?.ctaButtonLink || newSlideData.ctaButtonLink || ''}
                  onChange={handleSlideChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-light-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="md:col-span-2">
              </div>
            </div>
          </>
        )}

        {activeTab === 'megaDiscount' && (
          <>
            <h2 className="text-2xl font-bold mb-4">Mega Discount Section Settings</h2>
            <div className="mb-6 flex items-center">
              <input
                type="checkbox"
                id="showMegaDiscounts"
                name="showMegaDiscounts"
                checked={settings.showMegaDiscounts}
                onChange={handleChange}
                className="mr-2 leading-tight"
              />
              <label htmlFor="showMegaDiscounts" className="block text-light-700 text-sm font-bold">Show Mega Discount Section</label>
            </div>
          </>
        )}

        {activeTab === 'clientLogos' && (
          <>
            <h2 className="text-2xl font-bold mb-4">Client Logos Settings</h2>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Existing Logos</h3>
              {settings.clientLogos && settings.clientLogos.length === 0 ? (
                <p>No logos added yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {settings.clientLogos && settings.clientLogos.map((logo, index) => (
                    <div key={logo._id || index} className="border p-4 rounded-lg flex items-center justify-between">
                      <div className="flex items-center">
                        {logo.imageUrl && <Image src={logo.imageUrl || '/img/placeholder.jpg'} alt="Client Logo" width={50} height={50} className="mr-4 rounded" />}
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={() => handleEditLogo(logo)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded text-sm mr-2"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteLogo(logo._id!)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <h3 className="text-xl font-semibold mb-4">{editingLogo ? 'Edit Logo' : 'Add New Logo'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4 md:col-span-2">
                <label htmlFor="logoImage" className="block text-light-700 text-sm font-bold mb-2">Logo Image:</label>
                <input
                  type="file"
                  id="logoImage"
                  name="logoImage"
                  onChange={handleClientLogoFileChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-light-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {clientLogoPreview && (
                  <Image src={clientLogoPreview} alt="Logo Preview" width={100} height={100} className="mt-4 rounded" />
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="logoLink" className="block text-light-700 text-sm font-bold mb-2">Link (optional):</label>
                <input
                  type="text"
                  id="logoLink"
                  name="link"
                  value={editingLogo?.link || newLogoData.link || ''}
                  onChange={handleLogoChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-light-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="md:col-span-2">
                {editingLogo ? (
                  <button
                    type="button"
                    onClick={handleUpdateLogo}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Update Logo
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleAddLogo}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Add Logo
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        <div className="flex items-center justify-between mt-6">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Save Theme Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default ThemeOptionsPage;