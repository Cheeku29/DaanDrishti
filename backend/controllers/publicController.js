import NGO from '../models/NGO.js';

// GET /api/public/ngos
export const listVerifiedNgos = async (req, res, next) => {
  try {
    const list = await NGO.find({ verified: true }).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: list });
  } catch (e) {
    next(e);
  }
};

// GET /api/public/ngos/:id
export const getNgoDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ngo = await NGO.findOne({ _id: id, verified: true }).lean();
    if (!ngo) {
      return res.status(404).json({ success: false, message: 'NGO not found' });
    }
    res.json({ success: true, data: ngo });
  } catch (e) {
    next(e);
  }
};

