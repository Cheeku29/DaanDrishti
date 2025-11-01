import NGO from '../models/NGO.js';
import Donation from '../models/Donation.js';
import Spending from '../models/Spending.js';

// GET /api/ngo/dashboard
export const getDashboard = async (req, res, next) => {
  try {
    const ngo = await NGO.findOne({ userId: req.user.id });
    if (!ngo) {
      return res.status(404).json({ success: false, message: 'NGO profile not found' });
    }

    const donations = await Donation.find({ ngoId: ngo._id, status: 'completed' });
    const spending = await Spending.find({ ngoId: ngo._id });

    const totalReceived = donations.reduce((sum, d) => sum + d.amount, 0);
    const totalSpent = spending.reduce((sum, s) => sum + s.amount, 0);
    const available = totalReceived - totalSpent;

    const recentDonations = await Donation.find({ ngoId: ngo._id, status: 'completed' })
      .populate('donorId', 'name email')
      .sort({ date: -1 })
      .limit(5)
      .lean();

    res.json({
      success: true,
      data: {
        ngo,
        stats: {
          totalReceived,
          totalSpent,
          available,
          donationCount: donations.length,
          spendingCount: spending.length,
        },
        recentDonations,
      },
    });
  } catch (e) {
    next(e);
  }
};

// GET /api/ngo/donations
export const getNGODonations = async (req, res, next) => {
  try {
    const ngo = await NGO.findOne({ userId: req.user.id });
    if (!ngo) {
      return res.status(404).json({ success: false, message: 'NGO profile not found' });
    }

    const donations = await Donation.find({ ngoId: ngo._id })
      .populate('donorId', 'name email')
      .sort({ date: -1 })
      .lean();

    res.json({ success: true, data: donations });
  } catch (e) {
    next(e);
  }
};

// POST /api/ngo/spending
export const addSpending = async (req, res, next) => {
  try {
    const ngo = await NGO.findOne({ userId: req.user.id });
    if (!ngo) {
      return res.status(404).json({ success: false, message: 'NGO profile not found' });
    }

    const spending = await Spending.create({
      ngoId: ngo._id,
      ...req.body,
    });

    res.status(201).json({ success: true, data: spending });
  } catch (e) {
    next(e);
  }
};

// GET /api/ngo/spending
export const getSpending = async (req, res, next) => {
  try {
    const ngo = await NGO.findOne({ userId: req.user.id });
    if (!ngo) {
      return res.status(404).json({ success: false, message: 'NGO profile not found' });
    }

    const spending = await Spending.find({ ngoId: ngo._id }).sort({ date: -1 }).lean();

    res.json({ success: true, data: spending });
  } catch (e) {
    next(e);
  }
};

// PUT /api/ngo/spending/:id
export const updateSpending = async (req, res, next) => {
  try {
    const ngo = await NGO.findOne({ userId: req.user.id });
    if (!ngo) {
      return res.status(404).json({ success: false, message: 'NGO profile not found' });
    }

    const spending = await Spending.findOneAndUpdate(
      { _id: req.params.id, ngoId: ngo._id },
      req.body,
      { new: true }
    );

    if (!spending) {
      return res.status(404).json({ success: false, message: 'Spending record not found' });
    }

    res.json({ success: true, data: spending });
  } catch (e) {
    next(e);
  }
};

// PUT /api/ngo/profile
export const updateProfile = async (req, res, next) => {
  try {
    const ngo = await NGO.findOneAndUpdate(
      { userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!ngo) {
      return res.status(404).json({ success: false, message: 'NGO profile not found' });
    }

    res.json({ success: true, data: ngo });
  } catch (e) {
    next(e);
  }
};

// GET /api/ngo/profile
export const getProfile = async (req, res, next) => {
  try {
    const ngo = await NGO.findOne({ userId: req.user.id });
    if (!ngo) {
      return res.status(404).json({ success: false, message: 'NGO profile not found' });
    }

    res.json({ success: true, data: ngo });
  } catch (e) {
    next(e);
  }
};

