import mongoose from 'mongoose';

const ngoSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    name: { type: String, required: true },
    registrationNumber: { type: String, required: true, unique: true },
    description: { type: String },
    category: { type: String },
    state: { type: String },
    verified: { type: Boolean, default: false },
    documents: [{ url: String, name: String }],
  },
  { timestamps: true }
);

export default mongoose.model('NGO', ngoSchema);

