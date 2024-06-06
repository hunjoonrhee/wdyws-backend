const express = require('express');
const Cart = require('../models/cart');
const Product = require('../models/product');
const User = require('../models/user');
const cartController = {};
const mongoose = require('mongoose');

cartController.addProductToCart = async (req, res) => {
  try {
    if (req.isGuest) {
      return res.status(403).json({ status: 'forbidden', message: 'Please log in first' });
    }
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('user not found!');
    }
    const { productId, size } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send('product not found!');
    }
    const existingCart = await Cart.findOne({ userId: userId });

    if (existingCart) {
      const sameProductAndSameSize = existingCart.cartItems.find((i) => {
        return i.productId.toString() === productId && i.size === size;
      });
      if (sameProductAndSameSize) {
        sameProductAndSameSize.quantity += 1;
        await existingCart.save();
        return res.status(201).json(existingCart);
      } else {
        existingCart.cartItems.push({ productId: productId, size: size });
        await existingCart.save();
        return res.status(201).json(existingCart);
      }
    } else {
      const cartItems = [{ productId: productId, size: size }];
      const newCart = new Cart({ cartItems, userId });
      await newCart.save();
      return res.status(201).json(newCart);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error by adding product in to cart', err });
  }
};

cartController.getCartList = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(204).json({ data: 'no products' });
    }
    const existingCart = await Cart.findOne({ userId: userId });
    if (!existingCart) {
      return res.status(204).json({ data: 'no products' });
    } else {
      const cartItems = existingCart.cartItems;
      return res.status(200).json({ message: 'success', cartItems });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error by getting product list in cart', err });
  }
};

module.exports = cartController;
