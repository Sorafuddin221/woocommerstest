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
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [newSlideData, setNewSlideData] = useState<HeroSlide>({
    image: '',
    title: '',
    subtitle: '',
    ctaButtonText: '',
    ctaButtonLink: '',
  });
  const [editingLogo, setEditingLogo] = useState<ClientLogo | null>(null);
  const [newLogoData, setNewLogoData] = useState<ClientLogo>({
    imageUrl: '',
    link: '',
  });
  const [editingSocialLink, setEditingSocialLink] = useState<SocialLink | null>(null);
  const [newSocialLinkData, setNewSocialLinkData] = useState<SocialLink>({
    platform: '',
    url: '',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/settings/theme`);
        if (!response.ok) {
          throw new Error('Failed to fetch settings');
        }
        const data = await response.json();
        setSettings(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setSettings((prevSettings) => {
      if (!prevSettings) return null;
      return {
        ...prevSettings,
        [name]: type === 'checkbox' ? checked : value,
      };
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: 'headerLogoUrl' | 'slideImage' | 'clientLogoImage' | 'metaLogoUrl' | 'faviconUrl') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload file');
        }

        const data = await response.json();
        console.log('Upload response data:', data);
        if (data.success && data.urls && data.urls.length > 0) {
          const imageUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${data.urls[0]}`;
          if (field === 'slideImage') {
            if (editingSlide) {
              setEditingSlide((prev) => (prev ? { ...prev, image: imageUrl } : null));
            } else {
              setNewSlideData((prev) => ({ ...prev, image: imageUrl }));
            }
          } else if (field === 'clientLogoImage') {
            if (editingLogo) {
              setEditingLogo((prev) => (prev ? { ...prev, imageUrl: imageUrl } : null));
            } else {
              setNewLogoData((prev) => ({ ...prev, imageUrl: imageUrl }));
            }
          } else {
            setSettings((prevSettings) => {
              if (!prevSettings) return null;
              return {
                ...prevSettings,
                [field]: imageUrl,
              };
            });
          }
        } else {
          throw new Error(data.message || 'File upload failed with no URL returned.');
        }
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const handleSlideChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof HeroSlide) => {
    const { value } = e.target;
    if (editingSlide) {
      setEditingSlide((prev) => (prev ? { ...prev, [field]: value } : null));
    } else {
      setNewSlideData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof ClientLogo) => {
    const { value } = e.target;
    if (editingLogo) {
      setEditingLogo((prev) => (prev ? { ...prev, [field]: value } : null));
    } else {
      setNewLogoData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSocialLinkChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof SocialLink) => {
    const { value } = e.target;
    if (editingSocialLink) {
      setEditingSocialLink((prev) => (prev ? { ...prev, [field]: value } : null));
    } else {
      setNewSocialLinkData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleAddSlide = () => {
    if (settings) {
      setSettings((prev) => (prev ? { ...prev, heroSlides: [...(prev.heroSlides || []), { ...newSlideData, _id: undefined }] } : null));
      setNewSlideData({
        image: '',
        title: '',
        subtitle: '',
        ctaButtonText: '',
        ctaButtonLink: '',
      });
    }
  };

  const handleAddLogo = () => {
    if (settings) {
      setSettings((prev) => (prev ? { ...prev, clientLogos: [...(prev.clientLogos || []), { ...newLogoData, _id: undefined }] } : null));
      setNewLogoData({
        imageUrl: '',
        link: '',
      });
    }
  };

  const handleAddSocialLink = () => {
    if (settings) {
      setSettings((prev) => (prev ? { ...prev, socialLinks: [...(prev.socialLinks || []), { ...newSocialLinkData, _id: undefined }] } : null));
      setNewSocialLinkData({
        platform: '',
        url: '',
      });
    }
  };

  const handleEditSlide = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setNewSlideData({
      image: '',
      title: '',
      subtitle: '',
      ctaButtonText: '',
      ctaButtonLink: '',
    });
  };

  const handleEditLogo = (logo: ClientLogo) => {
    setEditingLogo(logo);
    setNewLogoData({
      imageUrl: logo.imageUrl,
      link: logo.link,
      _id: logo._id,
    });
  };

  const handleUpdateSlide = () => {
    if (settings && editingSlide) {
      setSettings((prev) =>
        prev
          ? {
              ...prev,
              heroSlides: (prev.heroSlides || []).map((slide) =>
                slide._id === editingSlide._id ? editingSlide : slide
              ),
            }
          : null
      );
      setEditingSlide(null);
    }
  };

  const handleUpdateLogo = () => {
    if (settings && editingLogo) {
      setSettings((prev) =>
        prev
          ? {
              ...prev,
              clientLogos: (prev.clientLogos || []).map((logo) =>
                logo._id === editingLogo._id ? editingLogo : logo
              ),
            }
          : null
      );
      setEditingLogo(null);
    }
  };

  const handleEditSocialLink = (link: SocialLink) => {
    setEditingSocialLink(link);
    setNewSocialLinkData({
      platform: '',
      url: '',
    });
  };

  const handleUpdateSocialLink = () => {
    if (settings && editingSocialLink) {
      setSettings((prev) =>
        prev
          ? {
              ...prev,
              socialLinks: (prev.socialLinks || []).map((link) =>
                link._id === editingSocialLink._id ? editingSocialLink : link
              ),
            }
          : null
      );
      setEditingSocialLink(null);
    }
  };

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

  const handleDeleteSocialLink = (id: string) => {
    if (settings && confirm('Are you sure you want to delete this social link?')) {
      setSettings((prev) =>
        prev ? { ...prev, socialLinks: (prev.socialLinks || []).filter((link) => link._id !== id) } : null
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!settings) return;

    try {
      console.log('Sending settings to backend:', settings);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/settings/theme`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();
      console.log('Backend response for saving settings:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save settings');
      }

      alert('Theme settings saved!');
    } catch (err: any) {
      setError(err.message);
    }
  };

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
                onChange={(e) => handleFileChange(e, 'faviconUrl')}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-light-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              {settings.faviconUrl && <img src={settings.faviconUrl} alt="Favicon" className="mt-4 h-10 w-10" />}
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
                onChange={(e) => handleFileChange(e, 'headerLogoUrl')}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-light-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              {settings.headerLogoUrl && <img src={settings.headerLogoUrl || '/img/placeholder.jpg'} alt="Header Logo" className="mt-4 h-20" />}
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
                        {slide.image && <Image src={slide.image || '/img/placeholder.jpg'} alt={slide.title} width={50} height={50} className="mr-4 rounded" />}
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
                  onChange={(e) => handleFileChange(e, 'slideImage')}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-light-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {(editingSlide?.image || newSlideData.image) && (
                  <Image src={editingSlide?.image || newSlideData.image} alt="Slide Preview" width={100} height={100} className="mt-4 rounded" />
                )}
              </div>
              <div className="mb-4 ">
                <label htmlFor="slideTitle" className="block text-light-700 text-sm font-bold mb-2">Title:</label>
                <input
                  type="text"
                  id="slideTitle"
                  name="title"
                  value={editingSlide?.title || newSlideData.title}
                  onChange={(e) => handleSlideChange(e, 'title')}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-light-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4 ">
                <label htmlFor="slideSubtitle" className="block text-light-700 text-sm font-bold mb-2">Subtitle:</label>
                <input
                  type="text"
                  id="slideSubtitle"
                  name="subtitle"
                  value={editingSlide?.subtitle || newSlideData.subtitle}
                  onChange={(e) => handleSlideChange(e, 'subtitle')}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-light-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4 ">
                <label htmlFor="slideCtaButtonText" className="block text-light-700 text-sm font-bold mb-2">CTA Button Text:</label>
                <input
                  type="text"
                  id="slideCtaButtonText"
                  name="ctaButtonText"
                  value={editingSlide?.ctaButtonText || newSlideData.ctaButtonText}
                  onChange={(e) => handleSlideChange(e, 'ctaButtonText')}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-light-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4 ">
                <label htmlFor="slideCtaButtonLink" className="block text-light-700 text-sm font-bold mb-2">CTA Button Link:</label>
                <input
                  type="text"
                  id="slideCtaButtonLink"
                  name="ctaButtonLink"
                  value={editingSlide?.ctaButtonLink || newSlideData.ctaButtonLink}
                  onChange={(e) => handleSlideChange(e, 'ctaButtonLink')}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-light-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="md:col-span-2">
                {editingSlide ? (
                  <button
                    type="button"
                    onClick={handleUpdateSlide}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Update Slide
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleAddSlide}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Add Slide
                  </button>
                )}
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
                  onChange={(e) => handleFileChange(e, 'clientLogoImage')}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-light-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {(editingLogo?.imageUrl || newLogoData.imageUrl) && (
                  <Image src={editingLogo?.imageUrl || newLogoData.imageUrl} alt="Logo Preview" width={100} height={100} className="mt-4 rounded" />
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="logoLink" className="block text-light-700 text-sm font-bold mb-2">Link (optional):</label>
                <input
                  type="text"
                  id="logoLink"
                  name="link"
                  value={editingLogo?.link || newLogoData.link}
                  onChange={(e) => handleLogoChange(e, 'link')}
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