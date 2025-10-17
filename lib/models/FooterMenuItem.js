import mongoose from 'mongoose';

const FooterMenuItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    default: 0,
  },
});

export default mongoose.models.FooterMenuItem || mongoose.model('FooterMenuItem', FooterMenuItemSchema);
