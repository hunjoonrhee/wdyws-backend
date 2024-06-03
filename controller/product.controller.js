const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Product = require('../models/product');
const productController = {};

productController.createProduct = async (req, res) => {
  try {
    const userId = req.userId;
    const isAdmin = req.isAdmin;
    if (!isAdmin) {
      return res.status(403).json({ message: 'permission denied' });
    }

    const { sku, name, description, price, size, image, stock, category, status, isDeleted } = req.body;
    const exProduct = await Product.findOne({ sku: sku });
    if (exProduct) {
      return res.status(403).send('already existing product!');
    }
    const newProduct = new Product({ sku, name, description, price, size, image, stock, category, status, isDeleted });

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
    const isAdmin = req.isAdmin;

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

productController.getAllProducts = async (req, res) => {
  try {
    const userId = req.userId;
    const isAdmin = req.isAdmin;
    const products = await Product.find({});
    if (!products) {
      return res.status(404).json({ message: 'No products are found!' });
    }
    if (isAdmin) {
      res.status(200).json(products);
    } else {
      let productsCopy;
      productsCopy = products.filter((p) => !p.isDeleted && p.status === 'active');
      console.log(productsCopy);

      res.status(200).json(productsCopy);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error by getting product', err });
  }
};

module.exports = productController;
