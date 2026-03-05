const User = require('../models/User');

// Simple token-based authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    // For demo purposes, we're using simple token format: token_userId_timestamp
    if (!token.startsWith('token_')) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format'
      });
    }

    const tokenParts = token.split('_');
    if (tokenParts.length !== 3) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format'
      });
    }

    const userId = tokenParts[1];
    const userModel = new User();
    const user = await userModel.findById(userId);

    if (!user || !user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    // Add user to request object
    req.user = user;
    next();

  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token && token.startsWith('token_')) {
      const tokenParts = token.split('_');
      if (tokenParts.length === 3) {
        const userId = tokenParts[1];
        const userModel = new User();
        const user = await userModel.findById(userId);
        
        if (user && user.is_active) {
          req.user = user;
        }
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

module.exports = {
  authenticateToken,
  optionalAuth
};