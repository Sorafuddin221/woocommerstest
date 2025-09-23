
import mongoose from 'mongoose';

const SocialLinkSchema = new mongoose.Schema({
  platform: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

export default mongoose.models.SocialLink || mongoose.model('SocialLink', SocialLinkSchema);
