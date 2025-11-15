/**
 * Express.js Application Setup
 * Restaurant Digital Menu SaaS Platform
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth.routes');
const tenantRoutes = require('./routes/tenant.routes');
const restaurantRoutes = require('./routes/restaurant.routes');
const publicRoutes = require('./routes/public.routes');

// Import middlewares
const authMiddleware = require('./middlewares/auth.middleware');
const tenantMiddleware = require('./middlewares/tenant.middleware');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

// Security & Logging
app.use(helmet());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Template engine for menu rendering
app.set('view engine', 'ejs');
app.set('views', './src/views');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tenants', authMiddleware, tenantMiddleware, tenantRoutes);
app.use('/api/restaurants', authMiddleware, tenantMiddleware, restaurantRoutes);
app.use('/menu', publicRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error middleware (must be last)
app.use(errorMiddleware);

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hospitality-saas', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Server startup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
