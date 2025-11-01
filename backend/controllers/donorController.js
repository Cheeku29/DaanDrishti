import Donation from '../models/Donation.js';
import Report from '../models/Report.js';
import NGO from '../models/NGO.js';

// GET /api/donations/my
export const getMyDonations = async (req, res, next) => {
  try {
    const donations = await Donation.find({ donorId: req.user.id })
      .populate('ngoId', 'name category state')
      .populate('socialEventId', 'title location')
      .sort({ date: -1 })
      .lean();

    res.json({ success: true, data: donations });
  } catch (e) {
    next(e);
  }
};

// GET /api/reports/impact
export const getImpactReports = async (req, res, next) => {
  try {
    // Get all NGOs the donor has donated to
    const donations = await Donation.find({ donorId: req.user.id }).distinct('ngoId');
    
    // Get all reports from those NGOs
    const reports = await Report.find({ ngoId: { $in: donations } })
      .populate('ngoId', 'name category')
      .sort({ year: -1, createdAt: -1 })
      .lean();

    res.json({ success: true, data: reports });
  } catch (e) {
    next(e);
  }
};

