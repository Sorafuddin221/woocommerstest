
import mongoose from 'mongoose';

const MenuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  page: {
    type: String,
    required: true,
  },
  children: [{
    name: {
      type: String,
      required: true,
    },
    page: {
      type: String,
      required: true,
    },
  }],
});

export default mongoose.models.MenuItem || mongoose.model('MenuItem', MenuItemSchema);
