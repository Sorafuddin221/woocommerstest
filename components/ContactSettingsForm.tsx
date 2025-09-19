
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface ContactSettings {
  address: string;
  phone: string;
  email: string;
}

const ContactSettingsForm = () => {
  const [settings, setSettings] = useState<ContactSettings>({ address: '', phone: '', email: '' });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/settings/contact`);
        setSettings(response.data);
      } catch (error: any) {
        console.error('Error fetching contact settings:', error);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings((prevSettings) => ({ ...prevSettings, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/settings/contact`, settings);
      alert('Contact settings updated successfully!');
    } catch (error: any) {
      console.error('Error updating contact settings:', error);
      alert('Failed to update contact settings.');
    }
  };

  return (
  <div className="bg-custom-surface  rounded-lg p-6">  
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:g-cols-2 gap-6">
        <label htmlFor="address" className="block text-light-700 font-bold mb-2">Address</label>
         
        <textarea
          id="address"
          name="address"
          rows={4}
          value={settings.address}
          onChange={handleChange}
          className="md:col-span-2 w-full bg-custom-card rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-custom-accent text-sm"
        ></textarea>
      </div>
      <div className="grid grid-cols-1 md:g-cols-2 gap-6">
        <label htmlFor="phone" className="block text-light-700 font-bold mt-2 mb-2">Phone</label>
        <input
          type="text"
          id="phone"
          name="phone"
          value={settings.phone}
          onChange={handleChange}
          className="md:col-span-2 w-full bg-custom-card rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-custom-accent text-sm"
        />
      </div>
      <div className="grid grid-cols-1 md:g-cols-2 gap-6">
        <label htmlFor="email" className="block text-light-700 font-bold mt-2 mb-2">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={settings.email}
          onChange={handleChange}
          className="md:col-span-2 w-full bg-custom-card rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-custom-accent text-sm"
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white mt-5 px-4 py-2 rounded-lg hover:bg-blue-600">Save Settings</button>
    </form>
    </div>
  );
};

export default ContactSettingsForm;
