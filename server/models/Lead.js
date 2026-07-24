const mongoose = require('mongoose');

/**
 * @typedef {Object} LeadDocument
 * @property {string} name
 * @property {string} email
 * @property {'Under $1k'|'$1k–$5k'|'$5k–$10k'|'$10k+'} budget
 * @property {string} message
 * @property {'New'|'Contacted'|'Closed'} status
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    budget: {
      type: String,
      required: [true, 'Budget range is required'],
      enum: {
        values: ['Under $1k', '$1k–$5k', '$5k–$10k', '$10k+'],
        message: 'Invalid budget range',
      },
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      minlength: [10, 'Message must be at least 10 characters'],
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Closed'],
      default: 'New',
    },
  },
  { timestamps: true }
);

// Index for duplicate-submission check
leadSchema.index({ email: 1, createdAt: -1 });

module.exports = mongoose.model('Lead', leadSchema);
