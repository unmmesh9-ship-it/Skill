/**
 * SkillMatrix Pro - Backend Server
 * Main Express.js Application Entry Point
 */

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const errorHandler = require('./middlewares/errorHandler');
const { syncDatabase } = require('./models');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const skillRoutes = require('./routes/skillRoutes');
const projectRoutes = require('./routes/projectRoutes');
const skillRequestRoutes = require('./routes/skillRequestRoutes');

// Initialize Express app
const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

// CORS middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SkillMatrix Pro API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skill-requests', skillRequestRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

// Initialize database and start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Sync Sequelize models
    await syncDatabase();
    
    // Start Express server
    app.listen(PORT, () => {
      console.log('===========================================');
      console.log('🚀 SkillMatrix Pro Server Started');
      console.log('===========================================');
      console.log(`📡 Server running in ${process.env.NODE_ENV || 'development'} mode`);
      console.log(`🔗 Server URL: http://localhost:${PORT}`);
      console.log(`💚 Health Check: http://localhost:${PORT}/health`);
      console.log(`🗄️  Using Sequelize ORM with PostgreSQL`);
      console.log('===========================================');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});

module.exports = app;
