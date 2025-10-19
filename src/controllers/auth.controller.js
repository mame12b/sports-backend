// src/controllers/auth.controller.js
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import logger from '../config/logger.js';
import dotenv from 'dotenv';
dotenv.config();

/**
 * @desc Register new user
 * @route POST /api/auth/register
 */
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: 'All fields are required' });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ message: 'User already exists' });

    const newUser = new User({ username, email, password, provider: 'local' });
    await newUser.save();

    // ✅ Generate JWT (1-day expiry)
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    logger.info(`New user registered: ${newUser.email}`);

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    logger.error(`Registration error: ${error.message}`);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc Login user
 * @route POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: 'User not found' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid credentials' });

    // ✅ Generate access token (same way as in register)
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    logger.info(`User logged in: ${user.email}`);

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        roles: user.roles,
      },
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc Get current authenticated user
 * @route GET /api/auth/me
 * @access Private
 */
export const me = async (req, res) => {
  if (!req.user)
    return res.status(401).json({ message: 'Unauthorized' });

  return res.json({ user: req.user });
};

/**
 * @desc Logout user
 * @route POST /api/auth/logout
 */
export const logout = async (req, res) => {
  try {
    logger.info(`User logged out: ${req.user ? req.user.email : 'Unknown user'}`);
    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    logger.error(`Logout error: ${error.message}`);
    return res.status(500).json({ message: 'Server error' });
  }
};
