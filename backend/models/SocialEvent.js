import mongoose from 'mongoose';

const socialEventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    moneyRequired: { type: Number, required: true, min: 0 },
    moneyRaised: { type: Number, default: 0, min: 0 },
    description: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
  },
  { timestamps: true }
);

export default mongoose.model('SocialEvent', socialEventSchema);

