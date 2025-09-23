import mongoose from 'mongoose';

const NewsletterSubscriptionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.NewsletterSubscription || mongoose.model('NewsletterSubscription', NewsletterSubscriptionSchema);