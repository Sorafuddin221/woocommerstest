
"use client";
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faLinkedin, faYoutube, faPinterest, faSnapchat, faTiktok, faWhatsapp, faReddit } from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { SocialLink } from '@/lib/interfaces';

const socialPlatforms = [
  { name: 'Facebook', icon: faFacebook },
  { name: 'Twitter', icon: faTwitter },
  { name: 'Instagram', icon: faInstagram },
  { name: 'LinkedIn', icon: faLinkedin },
  { name: 'YouTube', icon: faYoutube },
  { name: 'Pinterest', icon: faPinterest },
  { name: 'Snapchat', icon: faSnapchat },
  { name: 'TikTok', icon: faTiktok },
  { name: 'WhatsApp', icon: faWhatsapp },
  { name: 'Reddit', icon: faReddit },
];

const SocialSettingsForm = () => {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [newLink, setNewLink] = useState({ platform: 'Facebook', url: '' });

  useEffect(() => {
    // Fetch existing social links from the backend
    const fetchSocialLinks = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sociallinks`);
        const data = await res.json();
        if (data && data.data) {
          setSocialLinks(data.data);
        }
      } catch (error: any) {
        console.error('Error fetching social links:', error);
      }
    };
    fetchSocialLinks();
  }, []);

  const handleAddLink = async () => {
    if (newLink.url) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sociallinks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newLink),
        });
        const data = await res.json();
        setSocialLinks([...socialLinks, data.data]);
        setNewLink({ platform: 'Facebook', url: '' });
      } catch (error: any) {
        console.error('Error adding social link:', error);
      }
    }
  };

  const handleDeleteLink = async (id: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sociallinks/${id}`, {
        method: 'DELETE',
      });
      setSocialLinks(socialLinks.filter((link) => link._id !== id));
    } catch (error: any) {
      console.error('Error deleting social link:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Social Media Links</h2>
      <div className="space-y-4">
        {socialLinks.map((link, index) => (
          <div key={link._id} className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
            <div className="flex items-center">
              <FontAwesomeIcon icon={socialPlatforms.find(p => p.name === link.platform)?.icon || faGlobe} className="text-2xl mr-4" />
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{link.url}</a>
            </div>
            <button onClick={() => handleDeleteLink(link._id as string)} className="text-red-500 hover:text-red-700">Delete</button>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center space-x-4">
        <select
          value={newLink.platform}
          onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })}
          className="p-2 border rounded-lg"
        >
          {socialPlatforms.map(platform => (
            <option key={platform.name} value={platform.name}>{platform.name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Enter URL"
          value={newLink.url}
          onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
          className="flex-grow p-2 border rounded-lg"
        />
        <button onClick={handleAddLink} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Add New</button>
      </div>
    </div>
  );
};

export default SocialSettingsForm;
