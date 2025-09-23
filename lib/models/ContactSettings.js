import mongoose from 'mongoose';

const contactSettingsSchema = new mongoose.Schema({
  address: { type: String, default: '' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
});

export default mongoose.models.ContactSettings || mongoose.model('ContactSettings', contactSettingsSchema);