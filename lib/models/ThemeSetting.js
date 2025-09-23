import mongoose from 'mongoose';

const HeroSlideSchema = new mongoose.Schema({
  image: { type: String, default: '/img/placeholder.jpg' },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  ctaButtonText: { type: String, default: '' },
  ctaButtonLink: { type: String, default: '' },
});

const SocialLinkSchema = new mongoose.Schema({
  platform: { type: String, required: true }, // e.g., 'facebook', 'twitter', 'instagram'
  url: { type: String, required: true },
});

const ThemeSettingSchema = new mongoose.Schema({
  headerLogoUrl: { type: String, default: '/img/placeholder.jpg' },
  metaTitle: { type: String, default: 'My Affiliate App' },
  metaDescription: { type: String, default: 'A powerful affiliate marketing platform.' },
  metaLogoUrl: { type: String, default: '/img/placeholder.jpg' },
  faviconUrl: { type: String, default: '/img/favicon.ico' },
  headerSectionText: { type: String, default: 'Welcome to our store!' },
  showSearchForm: { type: Boolean, default: true },
  headerLogoText: { type: String, default: 'ffiliate' },
  showHeaderLogoImage: { type: Boolean, default: true },
  showHeaderLogoText: { type: Boolean, default: true },
  showMegaDiscounts: { type: Boolean, default: true },
  heroSlides: [HeroSlideSchema],
  clientLogos: [{ imageUrl: String, link: String }],
  socialLinks: [SocialLinkSchema], // New field for social media links
  customFields: [
    {
      name: { type: String, required: true },
      value: { type: mongoose.Schema.Types.Mixed },
      type: { type: String },
      label: { type: String },
    },
  ],
}, { timestamps: true });

export default mongoose.models.ThemeSetting || mongoose.model('ThemeSetting', ThemeSettingSchema);
