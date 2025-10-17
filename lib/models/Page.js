import mongoose from 'mongoose';

const PageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  content: {
    type: String,
    default: '',
  },
});

export default mongoose.models.Page || mongoose.model('Page', PageSchema);
