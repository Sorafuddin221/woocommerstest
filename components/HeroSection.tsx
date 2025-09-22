'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HeroSlide, Settings } from '@/lib/interfaces';

const HeroSection = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

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

  useEffect(() => {
    if (settings && settings.heroSlides && settings.heroSlides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prevSlide) =>
          prevSlide === (settings.heroSlides?.length || 0) - 1 ? 0 : prevSlide + 1
        );
      }, 10000); // Change slide every 10 seconds
      return () => clearInterval(interval);
    }
  }, [settings]);

  if (loading) return <p>Loading hero section...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!settings || !settings.heroSlides || settings.heroSlides.length === 0) return <p>No hero slides configured.</p>;

  const slide = settings.heroSlides[currentSlide];

  return (
    <main className="w-full min-h-[600px] bg-black text-white relative py-8 md:py-16">
      <div className="hero-slider-container h-full">
        <div className="hero-slider-wrapper h-full">
          <div key={currentSlide} className="hero-slider-item bg-black h-full flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-8 px-4">
            {/* Left Content */}
            <div className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left animate-slide-in-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 break-words">{slide.title}</h1>
              <p className="text-gray-400 text-sm md:text-base font-medium mb-6">{slide.subtitle}</p>
              {slide.ctaButtonText && slide.ctaButtonLink && (
                <Link href={slide.ctaButtonLink} className="bg-[#e99e23] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-orange-600 transition-colors animate-fade-in">
                  {slide.ctaButtonText}
                </Link>
              )}
            </div>
            {/* Right Image */}
            <div className="w-full md:w-1/2 flex items-center justify-center animate-slide-in-right">
              <Image src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${slide.image}`} alt={slide.title} width={300} height={300} className="w-full max-w-xs md:max-w-lg object-contain hover:scale-105 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </div>
      {/* Slider Navigation */}
      {settings.heroSlides.length > 1 && (
        <div className="hero-slider-navigation" id="hero-slider-navigation">
          {settings.heroSlides.map((_, index) => (
            <div
              key={index}
              className={`hero-slider-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            ></div>
          ))}
        </div>
      )}
    </main>
  );
};

export default HeroSection;