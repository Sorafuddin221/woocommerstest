'use client';

import { useEffect, useState } from 'react';

interface FooterSettings {
  gallery: (string | null)[];
  newsletterText?: string;
  copyrightText?: string;
  clientLogos?: (string | null)[];
}

const NUM_IMAGES = 4;

const FooterSettingsPage = () => {
  const [settings, setSettings] = useState<FooterSettings>({ gallery: Array(NUM_IMAGES).fill(null), clientLogos: Array(NUM_IMAGES).fill(null) });
  const [galleryFiles, setGalleryFiles] = useState<(File | null)[]>(Array(NUM_IMAGES).fill(null));
  const [galleryPreviews, setGalleryPreviews] = useState<(string | null)[]>(Array(NUM_IMAGES).fill(null));
  const [logoFiles, setLogoFiles] = useState<(File | null)[]>(Array(NUM_IMAGES).fill(null));
  const [logoPreviews, setLogoPreviews] = useState<(string | null)[]>(Array(NUM_IMAGES).fill(null));

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/settings/footer`);
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
          // Initialize previews with fetched data
          setGalleryPreviews(data.gallery || Array(NUM_IMAGES).fill(null));
          setLogoPreviews(data.clientLogos || Array(NUM_IMAGES).fill(null));
        }
      } catch (error) {
        console.error('Error fetching footer settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    });
    const responseData = await response.json();
    if (!response.ok) {
      console.error('Image upload failed response:', responseData);
      throw new Error(responseData.message || 'Image upload failed');
    }
    const data = responseData;
    console.log('Upload API response:', data);
    if (data.success && data.urls && data.urls.length > 0) {
      return data.urls[0];
    }
    throw new Error(data.message || 'Upload failed: No URL returned.');
  };

  const createChangeHandler = (index: number, files: (File | null)[], setFiles: (files: (File | null)[]) => void, previews: (string | null)[], setPreviews: (previews: (string | null)[]) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newFiles = [...files];
      newFiles[index] = file;
      setFiles(newFiles);

      const reader = new FileReader();
      reader.onloadend = () => {
        const newPreviews = [...previews];
        newPreviews[index] = reader.result as string;
        setPreviews(newPreviews);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryFileChange = (index: number) => createChangeHandler(index, galleryFiles, setGalleryFiles, galleryPreviews, setGalleryPreviews);
  const handleLogoFileChange = (index: number) => createChangeHandler(index, logoFiles, setLogoFiles, logoPreviews, setLogoPreviews);

  const createDeleteHandler = (index: number, files: (File | null)[], setFiles: (files: (File | null)[]) => void, previews: (string | null)[], setPreviews: (previews: (string | null)[]) => void, settingsKey: 'gallery' | 'clientLogos') => async () => {
    if (confirm('Are you sure you want to delete this image?')) {
      const newFiles = [...files];
      newFiles[index] = null;
      setFiles(newFiles);

      const newPreviews = [...previews];
      const imageUrlToDelete = newPreviews[index];
      newPreviews[index] = null;
      setPreviews(newPreviews);

      setSettings(prevSettings => {
        const newSettings = { ...prevSettings };
        const newArray = [...(newSettings[settingsKey] || [])];
        newArray[index] = null;
        newSettings[settingsKey] = newArray;
        return newSettings;
      });

      if (imageUrlToDelete) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/settings/footer/${encodeURIComponent(imageUrlToDelete)}`, {
            method: 'DELETE',
          });
          if (!res.ok) {
            throw new Error('Failed to delete image from database');
          }
        } catch (error) {
          console.error('Error deleting image from database:', error);
          alert('Error deleting image from database. Please try again.');
        }
      }
    }
  };

  const handleDeleteGalleryImage = (index: number) => createDeleteHandler(index, galleryFiles, setGalleryFiles, galleryPreviews, setGalleryPreviews, 'gallery')();
  const handleDeleteFooterLogo = (index: number) => createDeleteHandler(index, logoFiles, setLogoFiles, logoPreviews, setLogoPreviews, 'clientLogos')();

  const handleSave = async () => {
    try {
      const updatedSettings = { ...settings };

      // Ensure gallery and clientLogos are initialized
      if (!updatedSettings.gallery) updatedSettings.gallery = [];
      if (!updatedSettings.clientLogos) updatedSettings.clientLogos = [];

      // Process gallery images
      const newGallery = (await Promise.all(galleryFiles.map(async (file, index) => {
        if (file) {
          return await uploadImage(file);
        } else {
          return galleryPreviews[index] || null; // Use the preview URL if no new file is uploaded
        }
      }))) as (string | null)[];
      updatedSettings.gallery = newGallery;

      // Process client logos
      const newClientLogos = (await Promise.all(logoFiles.map(async (file, index) => {
        if (file) {
          return await uploadImage(file);
        } else {
          return logoPreviews[index] || null; // Use the preview URL if no new file is uploaded
        }
      }))) as (string | null)[];
      updatedSettings.clientLogos = newClientLogos;

      console.log('Sending updated settings to backend:', updatedSettings);

      const saveResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/settings/footer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings),
      });

      const responseData = await saveResponse.json();

      if (!saveResponse.ok) {
        throw new Error(responseData.message || 'Failed to save footer settings');
      }

      const savedSettings = responseData;
      console.log('Backend response after saving:', savedSettings);

      setSettings(savedSettings); // Update settings with the response from the backend
      alert('Footer settings saved successfully!');
      // window.location.reload(); // Temporarily commented out for debugging
    } catch (error) {
      console.error('Error saving footer settings:', error);
      alert(`Error saving settings: ${error}`);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Footer Settings</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[...Array(NUM_IMAGES)].map((_, index) => (
            <div key={index} className="border rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Image {index + 1}</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {galleryPreviews[index] ? (
                    <>
                      <img src={galleryPreviews[index]!} alt={`Gallery image ${index + 1}`} className="mx-auto h-24 w-24 object-cover rounded-md" />
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
                      <input id={`file-upload-${index}`} name={`file-upload-${index}`} type="file" className="sr-only" onChange={handleGalleryFileChange(index)} />
                    </label>
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
            {[...Array(NUM_IMAGES)].map((_, index) => (
              <div key={index} className="border rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo {index + 1}</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {logoPreviews[index] ? (
                      <>
                        <img src={logoPreviews[index]!} alt={`Client logo ${index + 1}`} className="mx-auto h-24 w-24 object-contain rounded-md" />
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
                        <input id={`logo-upload-${index}`} name={`logo-upload-${index}`} type="file" className="sr-only" onChange={handleLogoFileChange(index)} />
                      </label>
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
