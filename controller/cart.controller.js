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
      return res.status(404).json({ message: 'user not found!' });
    }
    const { productId, size, quantity } = req.body;
    if (!size) {
      return res.status(403).send('please select size!');
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send('product not found!');
    }
    const existingCart = await Cart.findOne({ userId: userId });

    if (existingCart) {
      const sameProductAndSameSize = existingCart.cartItems.find((i) => {
        return i.productId.equals(productId) && i.size === size;
      });
      if (sameProductAndSameSize) {
        sameProductAndSameSize.quantity += 1;
        await existingCart.save();
        return res.status(201).json(existingCart);
      } else {
        existingCart.cartItems.push({ productId, size, quantity });
        await existingCart.save();
        return res.status(201).json(existingCart);
      }
    } else {
      const newCart = new Cart({ userId });
      await newCart.save();
      newCart.cartItems = [...newCart.cartItems, { productId, size, quantity }];
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
      return res.status(204).json({ message: 'no products' });
    }
    const cart = await Cart.findOne({ userId: userId }).populate({
      path: 'cartItems',
      populate: {
        path: 'productId',
        model: 'Product',
      },
    });
    if (!cart) {
      return res.status(204).json({ data: 'no products' });
    } else {
      return res.status(200).json({ message: 'success', cart });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error by getting product list in cart', err });
  }
};

cartController.deleteProduct = async (req, res) => {
  try {
    const userId = req.userId;
    const cart = await Cart.findOne({ userId: userId });
    if (!cart) {
      return res.status(404).json({ data: 'Cart not found' });
    }
    const { productId, size } = req.body;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(204).json({ data: 'product not found' });
    } else {
      cart.cartItems = cart.cartItems.filter((item) => {
        return !item.productId.equals(productId) || item.size !== size;
      });

      await cart.save();
      return res.status(200).json({ message: 'success', cart });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error by deleting product from cart', err });
  }
};

cartController.updateProductAmount = async (req, res) => {
  try {
    const userId = req.userId;
    const cart = await Cart.findOne({ userId: userId });
    if (!cart) {
      return res.status(404).json({ data: 'Cart not found' });
    }
    const { productId, size, quantity } = req.body;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(204).json({ data: 'product not found' });
    } else {
      const updatedItem = cart.cartItems.find((item) => {
        return item.productId.equals(productId) && item.size === size;
      });

      updatedItem.quantity = quantity;

      await cart.save();
      return res.status(200).json({ message: 'success', cart });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error by deleting product from cart', err });
  }
};
module.exports = cartController;
