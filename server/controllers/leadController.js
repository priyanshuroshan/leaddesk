const Lead = require('../models/Lead');
const { body } = require('express-validator');

// ─── Validation Rules ─────────────────────────────────────────────────────────
const VALID_BUDGETS = ['Under $1k', '$1k–$5k', '$5k–$10k', '$10k+'];

/** Validation chain for creating a lead */
const createLeadValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('budget')
    .notEmpty().withMessage('Budget range is required')
    .isIn(VALID_BUDGETS).withMessage('Invalid budget range'),
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 10, max: 2000 }).withMessage('Message must be 10–2000 characters'),
];

// ─── Controller Functions ──────────────────────────────────────────────────────

/**
 * POST /api/leads — Create a new lead (public)
 * Prevents duplicate submissions from same email within 15 minutes
 */
const createLead = async (req, res, next) => {
  try {
    const { name, email, budget, message } = req.body;

    // Duplicate submission guard — same email within 15 minutes
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const recent = await Lead.findOne({
      email: email.toLowerCase(),
      createdAt: { $gte: fifteenMinutesAgo },
    });

    if (recent) {
      return res.status(429).json({
        success: false,
        message: 'A submission with this email was recently received. Please wait 15 minutes before trying again.',
      });
    }

    const lead = await Lead.create({ name, email, budget, message });

    res.status(201).json({
      success: true,
      message: 'Thank you! We\'ll be in touch soon.',
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/leads — Get all leads (protected)
 * Supports: search (name/email), status filter, sorting, pagination
 */
const getLeads = async (req, res, next) => {
  try {
    const {
      search = '',
      status = '',
      page = 1,
      limit = 10,
      sort = '-createdAt',
    } = req.query;

    const query = {};

    // Text search across name and email
    if (search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: regex }, { email: regex }];
    }

    // Status filter
    if (status && ['New', 'Contacted', 'Closed'].includes(status)) {
      query.status = status;
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [leads, total] = await Promise.all([
      Lead.find(query).sort(sort).skip(skip).limit(limitNum).lean(),
      Lead.countDocuments(query),
    ]);

    // Statistics
    const [newCount, contactedCount, closedCount, totalCount] = await Promise.all([
      Lead.countDocuments({ status: 'New' }),
      Lead.countDocuments({ status: 'Contacted' }),
      Lead.countDocuments({ status: 'Closed' }),
      Lead.countDocuments(),
    ]);

    res.json({
      success: true,
      data: leads,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
      stats: {
        total: totalCount,
        new: newCount,
        contacted: contactedCount,
        closed: closedCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/leads/:id — Update lead status (protected)
 */
const updateLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['New', 'Contacted', 'Closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be New, Contacted, or Closed.',
      });
    }

    const lead = await Lead.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found.' });
    }

    res.json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/leads/:id — Delete a lead (protected)
 */
const deleteLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findByIdAndDelete(id);

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found.' });
    }

    res.json({ success: true, message: 'Lead deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLead,
  getLeads,
  updateLead,
  deleteLead,
  createLeadValidation,
};
