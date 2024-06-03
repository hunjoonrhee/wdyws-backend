const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Product = require('../models/product');
const productController = {};

productController.createProduct = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (user.role === 'customer') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const { sku, name, description, price, image, stock, category, status, isDeleted } = req.body;
    const exProduct = await Product.findOne({ sku: sku });
    if (exProduct) {
      return res.status(403).send('already existing product!');
    }
    const newProduct = new Product({ sku, name, description, price, image, stock, category, status, isDeleted });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error by creating product', err });
  }
};

module.exports = productController;
