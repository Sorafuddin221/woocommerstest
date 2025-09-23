import mongoose from 'mongoose';

const heroSectionSchema = new mongoose.Schema({
  heading: { type: String, default: '' },
  subheading: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  buttonUrl: { type: String, default: '' },
});

const settingSchema = new mongoose.Schema({
  productsPageHero: heroSectionSchema,
  blogPageHero: heroSectionSchema,
  contactPageHero: heroSectionSchema,
});

export default mongoose.models.Setting || mongoose.model('Setting', settingSchema);
