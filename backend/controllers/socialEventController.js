import SocialEvent from '../models/SocialEvent.js';
import Donation from '../models/Donation.js';
import NGO from '../models/NGO.js';

// GET /api/admin/social-events
export const getAllSocialEvents = async (req, res, next) => {
  try {
    const events = await SocialEvent.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    // Get funding information for each event
    const eventsWithFunding = await Promise.all(
      events.map(async (event) => {
        const donations = await Donation.find({
          socialEventId: event._id,
          status: 'completed',
        }).populate('ngoId', 'name');

        return {
          ...event,
          donations,
          fundedBy: donations.map((d) => d.ngoId).filter(Boolean),
        };
      })
    );

    res.json({ success: true, data: eventsWithFunding });
  } catch (e) {
    next(e);
  }
};

// POST /api/admin/social-events
export const createSocialEvent = async (req, res, next) => {
  try {
    const event = await SocialEvent.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(201).json({ success: true, data: event });
  } catch (e) {
    next(e);
  }
};

// GET /api/admin/social-events/:id
export const getSocialEventDetails = async (req, res, next) => {
  try {
    const event = await SocialEvent.findById(req.params.id)
      .populate('createdBy', 'name email')
      .lean();

    if (!event) {
      return res.status(404).json({ success: false, message: 'Social event not found' });
    }

    const donations = await Donation.find({
      socialEventId: event._id,
      status: 'completed',
    })
      .populate('ngoId', 'name')
      .populate('donorId', 'name email')
      .lean();

    res.json({
      success: true,
      data: {
        ...event,
        donations,
        fundedBy: donations.map((d) => d.ngoId).filter(Boolean),
      },
    });
  } catch (e) {
    next(e);
  }
};

// PUT /api/admin/social-events/:id
export const updateSocialEvent = async (req, res, next) => {
  try {
    const event = await SocialEvent.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!event) {
      return res.status(404).json({ success: false, message: 'Social event not found' });
    }

    res.json({ success: true, data: event });
  } catch (e) {
    next(e);
  }
};

