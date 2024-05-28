const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const userController = {};

userController.signUp = async (req, res) => {
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
module.exports = userController;
