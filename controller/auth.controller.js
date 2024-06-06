const authController = {};
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/user');
dotenv.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

authController.authenticate = (req, res, next) => {
  try {
    let isGuest = false;
    const tokenString = req.headers.authorization;
    if (tokenString === 'Bearer null' || !tokenString) {
      isGuest = true;
      req.isGuest = isGuest;
      next();
      return;
    }

    const token = tokenString.replace('Bearer ', '');
    jwt.verify(token, JWT_SECRET_KEY, (error, payload) => {
      if (error) {
        throw new Error('invalid token');
      }
      req.userId = payload._id;
      next();
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

authController.checkAdmin = async (req, res, next) => {
  try {
    if (req.isGuest) {
      next();
      return;
    }
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('user not found');
    }
    let isAdmin = true;
    if (user.role !== 'admin') {
      isAdmin = false;
    }
    req.isAdmin = isAdmin;
    next();
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

module.exports = authController;
