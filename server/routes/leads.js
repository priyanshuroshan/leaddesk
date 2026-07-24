const express = require('express');
const router = express.Router();
const {
  createLead,
  getLeads,
  updateLead,
  deleteLead,
  createLeadValidation,
} = require('../controllers/leadController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

// Public — submit a new lead
router.post('/', validate(createLeadValidation), createLead);

// Protected — admin only
router.get('/', protect, getLeads);
router.patch('/:id', protect, updateLead);
router.delete('/:id', protect, deleteLead);

module.exports = router;
