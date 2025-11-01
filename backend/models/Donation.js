import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema(
  {
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'NGO', required: true, index: true },
    socialEventId: { type: mongoose.Schema.Types.ObjectId, ref: 'SocialEvent', index: true },
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, default: Date.now },
    paymentId: { type: String },
    orderId: { type: String },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  },
  { timestamps: true }
);

export default mongoose.model('Donation', donationSchema);

