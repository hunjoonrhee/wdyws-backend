const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Product = require('../models/product');
const productController = {};

productController.createProduct = async (req, res) => {
  try {
    const userId = req.userId;
    const isAdmin = await isUserAdmin(userId, res);
    if (!isAdmin) {
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

productController.getProductBySKU = async (req, res) => {
  try {
    const userId = req.userId;
    const isAdmin = await isUserAdmin(userId, res);

    const sku = req.params.sku;
    const product = await Product.findOne({ sku: sku });
    if (!product) {
      return res.status(404).send('product not found or unknown sku!');
    }
    if (!isAdmin) {
      if (product.isDeleted || product.status === 'inactive') {
        return res.status(400).json({ message: 'this product is deleted or inactive' });
      }
      res.status(200).json(product);
    }
    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error by getting product', err });
  }
};

const isUserAdmin = async (userId, res) => {
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'user not found' });
  }
  return user.role !== 'customer';
};
module.exports = productController;
