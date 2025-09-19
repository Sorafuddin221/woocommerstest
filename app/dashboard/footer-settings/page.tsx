'use client';

import { useEffect, useState } from 'react';

interface FooterSettings {
  gallery: string[];
  newsletterText?: string;
  copyrightText?: string;
  clientLogos?: string[];
}

const FooterSettingsPage = () => {
  const [settings, setSettings] = useState<FooterSettings>({ gallery: [] });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/settings/footer`);
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (error) {
        console.error('Error fetching footer settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'x-filename': file.name,
        },
      });
      const data = await res.json();
      if (data.urls && data.urls.length > 0) {
        const newGallery = [...(settings?.gallery || [])];
        newGallery[index] = `${process.env.NEXT_PUBLIC_BACKEND_URL}${data.urls[0]}`;        setSettings({ ...settings, gallery: newGallery });
      } else {
        console.error('Upload response did not contain a URL.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'x-filename': file.name,
        },
      });
      const data = await res.json();
      if (data.urls && data.urls.length > 0) {
        const newLogos = [...(settings?.clientLogos || [])];
        newLogos[index] = `${process.env.NEXT_PUBLIC_BACKEND_URL}${data.urls[0]}`;        setSettings({ ...settings, clientLogos: newLogos });
      } else {
        console.error('Upload response did not contain a URL.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleDeleteGalleryImage = (index: number) => {
    if (confirm('Are you sure you want to delete this image?')) {
      const newGallery = [...(settings?.gallery || [])];
      newGallery[index] = ''; // Set to empty string to clear the image
      setSettings({ ...settings, gallery: newGallery });
    }
  };

  const handleDeleteFooterLogo = (index: number) => {
    if (confirm('Are you sure you want to delete this logo?')) {
      const newLogos = [...(settings?.clientLogos || [])];
      newLogos[index] = ''; // Set to empty string to clear the image
      setSettings({ ...settings, clientLogos: newLogos });
    }
  };

  const handleSave = async () => {
    console.log('Saving settings:', settings);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/settings/footer`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
    } catch (error) {
      console.error('Error saving footer settings:', error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Footer Settings</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="border rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Image {index + 1}</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {settings?.gallery[index] ? (
                    <>
                      <img src={settings.gallery[index]} alt={`Gallery image ${index + 1}`} className="mx-auto h-24 w-24 object-cover rounded-md" />
                      <button
                        type="button"
                        onClick={() => handleDeleteGalleryImage(index)}
                        className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor={`file-upload-${index}`} className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                      <span>Upload a file</span>
                      <input id={`file-upload-${index}`} name={`file-upload-${index}`} type="file" className="sr-only" onChange={(e) => handleFileChange(e, index)} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <label htmlFor="newsletterText" className="block text-sm font-medium text-gray-700">Newsletter Text</label>
          <textarea
            id="newsletterText"
            name="newsletterText"
            rows={3}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black"
            value={settings?.newsletterText || ''}
            onChange={(e) => setSettings({ ...settings, newsletterText: e.target.value })}
          />
        </div>
        <div className="mt-8">
          <label htmlFor="copyrightText" className="block text-sm font-medium text-gray-700">Copyright Text</label>
          <input
            type="text"
            id="copyrightText"
            name="copyrightText"
            className="mt-1 py-2 px-3 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black"
            value={settings?.copyrightText || ''}
            onChange={(e) => setSettings({ ...settings, copyrightText: e.target.value })}
          />
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Client Logos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="border rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo {index + 1}</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {settings?.clientLogos?.[index] ? (
                      <>
                        <img src={settings.clientLogos[index]} alt={`Client logo ${index + 1}`} className="mx-auto h-24 w-24 object-contain rounded-md" />
                        <button
                          type="button"
                          onClick={() => handleDeleteFooterLogo(index)}
                          className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor={`logo-upload-${index}`} className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                        <span>Upload a file</span>
                        <input id={`logo-upload-${index}`} name={`logo-upload-${index}`} type="file" className="sr-only" onChange={(e) => handleLogoFileChange(e, index)} />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 flex justify-end">
          <button onClick={handleSave} className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default FooterSettingsPage;
