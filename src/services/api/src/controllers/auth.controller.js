/**
 * Authentication Controller
 */

const AdminUser = require('../models/AdminUser');
const Tenant = require('../models/Tenant');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { email, password, tenantName } = req.body;

    // Check if user exists
    const existingUser = await AdminUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create tenant
    const tenant = new Tenant({
      name: tenantName,
      email
    });
    await tenant.save();

    // Create admin user
    const user = new AdminUser({
      email,
      password,
      tenantId: tenant._id,
      role: 'admin'
    });
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, tenantId: tenant._id, email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        tenantId: tenant._id,
        tenantName: tenant.name
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await AdminUser.findOne({ email }).populate('tenantId');
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, tenantId: user.tenantId._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        tenantId: user.tenantId._id,
        tenantName: user.tenantId.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await AdminUser.findById(req.user.userId).populate('tenantId');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
