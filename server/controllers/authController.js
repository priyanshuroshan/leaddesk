const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

/**
 * Generate a signed JWT token for an admin
 * @param {string} id - Admin document _id
 * @returns {string}
 */
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

/**
 * Set JWT as HttpOnly cookie on response
 * @param {import('express').Response} res
 * @param {string} token
 * @param {boolean} rememberMe - extend cookie life if true
 */
const sendTokenCookie = (res, token, rememberMe = false) => {
  const maxAge = rememberMe
    ? 7 * 24 * 60 * 60 * 1000  // 7 days
    : 24 * 60 * 60 * 1000;      // 1 day

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge,
  });
};

// ─── Controllers ──────────────────────────────────────────────────────────────

/**
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password, rememberMe = false } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    // Find admin and explicitly select password field
    const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = signToken(admin._id);
    sendTokenCookie(res, token, rememberMe);

    res.json({
      success: true,
      message: 'Login successful.',
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/logout
 */
const logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(0),
  });

  res.json({ success: true, message: 'Logged out successfully.' });
};

/**
 * GET /api/auth/me — Returns the currently authenticated admin
 */
const me = (req, res) => {
  res.json({
    success: true,
    data: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    },
  });
};

module.exports = { login, logout, me };
