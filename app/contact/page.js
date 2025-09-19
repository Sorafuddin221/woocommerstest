'use client';

import { useEffect, useState } from 'react';
import ContactPageTemplate from '@/components/ContactPageTemplate';
import Link from 'next/link';
import axios from 'axios';

export default function ContactPage() {
  const [settings, setSettings] = useState({});
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [heroSettings, setHeroSettings] = useState(null);

  useEffect(() => {
    const fetchContactSettings = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/settings/contact`);
        if (!res.ok) {
          console.error('Failed to fetch contact settings:', res.status, res.statusText);
          setSettings({}); // Set to empty object on failure
          return;
        }
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await res.text();
          console.error('Received non-JSON response for contact settings:', text);
          setSettings({}); // Set to empty object on non-JSON response
          return;
        }
        const data = await res.json();
        console.log(data);
        setSettings(data);
      } catch (error) {
        console.error('Error fetching or parsing contact settings:', error);
        setSettings({}); // Set to empty object on error
      }
    };

    const fetchHeroSettings = async () => {
      try {
        const response = await axios.get('/api/settings');
        if (response.data && response.data.contactPageHero) {
          setHeroSettings(response.data.contactPageHero);
        }
      } catch (error) {
        console.error('Error fetching hero settings:', error);
      }
    };

    fetchContactSettings();
    fetchHeroSettings();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log('Server response:', data);
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error submitting contact form:', error);
    }
  };

  return (
    <ContactPageTemplate
      title={heroSettings?.heading || "Contact Us"}
      heroImage={heroSettings?.imageUrl || "/img/bedroom-747525_1920.jpg"}
      subheading={heroSettings?.subheading || ""}
      buttonUrl={heroSettings?.buttonUrl || ""}
    >
      {/* Contact Section Wrapper */}
      <div className="bg-white rounded-xl shadow-lg flex flex-col md:flex-row w-full max-w-4xl">
        {/* Contact Form */}
        <div className="p-8 md:p-12 w-full md:w-3/5">
          <h2 className="text-3xl font-semibold mb-6 text-gray-900">{settings.formTitle || 'Send us a Message'}</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" id="name" placeholder="Your full name..." value={formData.name} onChange={handleChange} className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" id="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
              </div>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
              <textarea id="message" placeholder="Type here..." rows="4" value={formData.message} onChange={handleChange} className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"></textarea>
            </div>
            <button type="submit" className="w-full md:w-auto px-6 py-3 mt-4 text-sm font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors">
              SEND MESSAGE
            </button>
          </form>
        </div>

        {/* Contact Details */}
        <div className="bg-gray-800 p-8 md:p-12 text-white rounded-b-xl md:rounded-r-xl md:rounded-bl-none w-full md:w-2/5 flex flex-col justify-center">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <span className="p-2 bg-gray-700 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-2 2v4a2 2 0 01-2 2H7a2 2 0 01-2-2v-4" />
                  </svg>
                </span>
                Email Address
              </h3>
              <p className="text-gray-400">
                <Link href={`mailto:${settings.email}`} className="hover:underline">{settings.email}</Link>
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <span className="p-2 bg-gray-700 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                Headquarters
              </h3>
              <p className="text-gray-400">
                {settings.address}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <span className="p-2 bg-gray-700 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </span>
                Phone Number
              </h3>
              <p className="text-gray-400">
                {settings.phone}
              </p>
            </div>
          </div>
        </div>
      </div>
    </ContactPageTemplate>
  );
}
