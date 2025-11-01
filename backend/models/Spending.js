import mongoose from 'mongoose';

const spendingSchema = new mongoose.Schema(
  {
    ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'NGO', required: true, index: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    description: { type: String },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('Spending', spendingSchema);

