import Razorpay from 'razorpay';
import { validationResult } from 'express-validator';
import Donation from '../models/Donation.js';
import NGO from '../models/NGO.js';
import crypto from 'crypto';

let razorpay = null;
const getRazorpayInstance = () => {
  if (!razorpay) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    
    if (!keyId || !keySecret) {
      console.error('Razorpay keys not configured in .env file');
      console.error('RAZORPAY_KEY_ID:', keyId ? '***present***' : 'missing');
      console.error('RAZORPAY_KEY_SECRET:', keySecret ? '***present***' : 'missing');
      return null;
    }
    
    razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }
  return razorpay;
};

// POST /api/payments/create-order
export const createOrder = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const razorpayInstance = getRazorpayInstance();
    if (!razorpayInstance) {
      return res.status(503).json({
        success: false,
        message: 'Payment gateway not configured. Please configure Razorpay keys in backend/.env',
      });
    }

    const { ngoId, amount } = req.body;

    if (!ngoId) {
      return res.status(400).json({ success: false, message: 'NGO ID is required' });
    }
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    const ngo = await NGO.findById(ngoId);
    if (!ngo) {
      return res.status(404).json({ success: false, message: 'NGO not found' });
    }
    if (!ngo.verified) {
      return res.status(400).json({ success: false, message: 'NGO is not verified' });
    }

    const amountInPaise = Math.round(parseFloat(amount) * 100);
    if (amountInPaise < 100) {
      return res.status(400).json({ success: false, message: 'Minimum donation amount is ₹1' });
    }

    const timestamp = Date.now().toString().slice(-10);
    const userIdShort = req.user.id.toString().slice(-8);
    const receipt = `don_${timestamp}_${userIdShort}`;

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: receipt,
      notes: {
        donorId: req.user.id.toString(),
        ngoId: ngoId.toString(),
        ngoName: ngo.name,
        fullTimestamp: Date.now().toString(),
      },
    };

    let order;
    try {
      order = await razorpayInstance.orders.create(options);
    } catch (razorpayError) {
      console.error('Razorpay API error:', razorpayError);
      if (razorpayError.error && razorpayError.error.description) {
        return res.status(400).json({
          success: false,
          message: razorpayError.error.description || 'Failed to create payment order',
          error: process.env.NODE_ENV === 'development' ? razorpayError.error : undefined,
        });
      }
      throw razorpayError;
    }

    res.json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (e) {
    console.error('Payment order creation error:', e);
    if (e.error && e.error.description) {
      return res.status(400).json({
        success: false,
        message: e.error.description || 'Failed to create payment order',
      });
    }
    next(e);
  }
};

// POST /api/payments/verify
export const verifyPayment = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return res.status(503).json({
        success: false,
        message: 'Payment gateway not configured. Please configure Razorpay keys in backend/.env',
      });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, ngoId, amount } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment details' });
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed: Invalid signature' });
    }

    const ngo = await NGO.findById(ngoId);
    if (!ngo) {
      return res.status(404).json({ success: false, message: 'NGO not found' });
    }
    if (!ngo.verified) {
      return res.status(400).json({ success: false, message: 'NGO is not verified' });
    }

    const donation = await Donation.create({
      donorId: req.user.id,
      ngoId: ngoId,
      amount: parseFloat(amount),
      date: new Date(),
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      status: 'completed',
    });

    res.json({
      success: true,
      data: {
        donation,
        message: 'Payment successful and donation recorded',
      },
    });
  } catch (e) {
    console.error('Payment verification error:', e);
    next(e);
  }
};

