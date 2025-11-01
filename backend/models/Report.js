import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'NGO', required: true, index: true },
    title: { type: String, required: true },
    summary: { type: String },
    impactMetrics: { type: Map, of: String },
    year: { type: Number },
    attachments: [{ url: String, name: String }],
  },
  { timestamps: true }
);

export default mongoose.model('Report', reportSchema);

