import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, phone, aadhaar, email, password, role } = req.body;

    // Basic validation
    if (!name || !phone || !password) {
      return res.status(400).json({ message: 'Name, phone, and password are required.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { phone },
        ...(email ? [{ email }] : []),
        ...(aadhaar ? [{ aadhaar }] : [])
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'User with this phone, email, or Aadhaar already exists'
      });
    }

    // Generate Verification OTP (Just for record, not used)
    const verificationOTP = Math.floor(100000 + Math.random() * 900000).toString();

    // Create and save user
    const user = new User({
      name,
      phone,
      aadhaar,
      email,
      password,
      role: role || 'patient',
      verificationOTP,
      isVerified: true // Auto-verify explicitly requested
    });

    await user.save();

    // [SIMULATION] Log OTP to console for debugging if needed, but no email sent.
    if (email) {
      console.log(`[SIMULATION] Register OTP for ${email} (Skipped): ${verificationOTP}`);
    }

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Duplicate field value entered.' });
    }
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// Verify Email Route (Left for compatibility, but not forced)
router.post('/verify-email', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email, verificationOTP: otp });

    if (!user) {
      return res.status(400).json({ message: 'Invalid OTP or Email' });
    }

    user.isVerified = true;
    user.verificationOTP = undefined; // Clear OTP
    await user.save();

    res.json({ message: 'Email verified successfully!' });
  } catch (error) {
    console.error('Verify Email Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const user = await User.findOne({
      $or: [
        { phone: identifier },
        { email: identifier },
        { aadhaar: identifier }
      ]
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Forgot Password - Send OTP (Simulation)
router.post('/forgot-password', async (req, res) => {
  try {
    const { identifier } = req.body;
    const user = await User.findOne({
      $or: [
        { phone: identifier },
        { email: identifier }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Simulation Only
    if (user.email) {
      console.log(`[SIMULATION] Reset OTP for ${user.email}: ${otp}`);
    } else {
      console.log(`[SIMULATION] SMS OTP for ${user.phone}: ${otp}`);
    }

    res.json({ message: 'OTP sent successfully (Check console)' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify Password Reset OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { identifier, otp } = req.body;
    const user = await User.findOne({
      $or: [
        { phone: identifier },
        { email: identifier }
      ],
      resetPasswordOTP: otp,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { identifier, otp, newPassword } = req.body;

    const user = await User.findOne({
      $or: [
        { phone: identifier },
        { email: identifier }
      ],
      resetPasswordOTP: otp,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.password = newPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      phone: req.user.phone,
      email: req.user.email,
      role: req.user.role,
      profile: req.user.profile
    }
  });
});

export default router;