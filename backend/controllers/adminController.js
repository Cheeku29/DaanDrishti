import User from '../models/User.js';
import NGO from '../models/NGO.js';
import Donation from '../models/Donation.js';
import SocialEvent from '../models/SocialEvent.js';

// GET /api/admin/dashboard
export const getDashboard = async (req, res, next) => {
  try {
    const totalNGOs = await NGO.countDocuments();
    const verifiedNGOs = await NGO.countDocuments({ verified: true });
    const pendingNGOs = await NGO.countDocuments({ verified: false });
    const totalDonors = await User.countDocuments({ role: 'donor' });
    const totalDonations = await Donation.countDocuments({ status: 'completed' });
    const totalAmount = await Donation.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalSocialEvents = await SocialEvent.countDocuments();

    res.json({
      success: true,
      data: {
        stats: {
          totalNGOs,
          verifiedNGOs,
          pendingNGOs,
          totalDonors,
          totalDonations,
          totalAmount: totalAmount[0]?.total || 0,
          totalSocialEvents,
        },
      },
    });
  } catch (e) {
    next(e);
  }
};

// GET /api/admin/ngos/pending
export const getPendingNGOs = async (req, res, next) => {
  try {
    const ngos = await NGO.find({ verified: false })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: ngos });
  } catch (e) {
    next(e);
  }
};

// PUT /api/admin/ngos/:id/verify
export const verifyNGO = async (req, res, next) => {
  try {
    const { verified } = req.body;
    const ngo = await NGO.findByIdAndUpdate(
      req.params.id,
      { verified: verified === true },
      { new: true }
    );

    if (!ngo) {
      return res.status(404).json({ success: false, message: 'NGO not found' });
    }

    res.json({ success: true, data: ngo });
  } catch (e) {
    next(e);
  }
};

// GET /api/admin/ngos
export const getAllNGOs = async (req, res, next) => {
  try {
    const ngos = await NGO.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: ngos });
  } catch (e) {
    next(e);
  }
};

// GET /api/admin/analytics
export const getAnalytics = async (req, res, next) => {
  try {
    const totalNGOs = await NGO.countDocuments();
    const totalSocialEvents = await SocialEvent.countDocuments();
    const totalDonors = await User.countDocuments({ role: 'donor' });

    const topNGOs = await Donation.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: '$ngoId',
          totalAmount: { $sum: '$amount' },
          donationCount: { $sum: 1 },
        },
      },
      { $sort: { totalAmount: -1 } },
      { $limit: 10 },
    ]);

    const ngoIds = topNGOs.map((n) => n._id);
    const ngos = await NGO.find({ _id: { $in: ngoIds } }).lean();
    const ngoMap = new Map(ngos.map((n) => [n._id.toString(), n]));

    const topNGOsWithNames = topNGOs.map((n) => ({
      ...n,
      ngo: ngoMap.get(n._id.toString()),
    }));

    res.json({
      success: true,
      data: {
        charts: {
          ngoVsSocialEvents: {
            ngo: totalNGOs,
            socialEvents: totalSocialEvents,
          },
          ngoVsDonors: {
            ngo: totalNGOs,
            donors: totalDonors,
          },
        },
        topNGOs: topNGOsWithNames,
      },
    });
  } catch (e) {
    next(e);
  }
};

// GET /api/admin/donors
export const getAllDonors = async (req, res, next) => {
  try {
    const donors = await User.find({ role: 'donor' })
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: donors });
  } catch (e) {
    next(e);
  }
};

