const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const config = require('./config');
const logger = require('./utils/logger');
const errorHandler = require('./middlewares/errorHandler.middleware');
const { apiLimiter } = require('./middlewares/rateLimit.middleware');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.urls.frontend,
  credentials: true,
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// View engine setup (EJS for menu rendering)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// Rate limiting
app.use('/api', apiLimiter);

// Routes
app.use('/api/v1', require('./routes'));
app.use('/menu', require('./routes/menu.routes'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found',
    },
  });
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;

