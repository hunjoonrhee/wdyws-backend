const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const userController = {};

userController.signUp = async (req, res) => {
  if (req.body.email.includes('admin')) {
    req.body.role = 'admin';
  }
  const { email, password, name, role } = req.body;
  const exUser = await User.findOne({ email: email });
  if (exUser) {
    return res.status(403).send('already used email.');
  }

  const hashPassword = await bcrypt.hash(password, 13);
  const newUser = new User({ email, password: hashPassword, name, role });
  try {
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error by signing up', err });
  }
};

userController.loginWithEmail = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  try {
    if (!user) {
      return res.status(404).send('user not found');
    }
    const isMatched = await bcrypt.compareSync(password, user.password);
    if (!isMatched) {
      return res.status(403).send('wrong password');
    }
    const token = user.generateToken();
    res.status(200).json({ status: 'success', user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error by logging in', err });
  }
};

userController.logout = async (req, res) => {
  req.session.destroy();
  res.send('ok');
};

userController.getMe = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (user) {
      res.status(200).json(user);
    }
  } catch (err) {
    res.status(404).json({ status: 'error', error: err.message });
  }
};

module.exports = userController;
