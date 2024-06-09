const express = require('express');
const Cart = require('../models/cart');
const Product = require('../models/product');
const User = require('../models/user');
const Order = require('../models/order');
const orderController = {};
const mongoose = require('mongoose');
const productConrtoller = require('./product.controller');
const RandomStringGenerator = require('../utils/randomStringGenerator');

orderController.createOrder = async (req, res) => {
  try {
    if (req.isGuest) {
      return res.status(403).json({ status: 'forbidden', message: 'Please log in first' });
    }
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'user not found!' });
    }
    const { totalPrice, shipTo, contact, orderList } = req.body;
    const insufficientStockItems = await productConrtoller.checkItemListStock(orderList);

    if (insufficientStockItems.length > 0) {
      const errorMessage = insufficientStockItems.reduce((total, item) => (total += item.message), '');
      return res.status(400).json({ message: errorMessage });
    }
    const newOrder = new Order({
      userId,
      totalPrice: totalPrice,
      shipTo: shipTo,
      contact: contact,
      orderItems: orderList,
      orderNum: RandomStringGenerator.generateRandomString(),
    });
    await newOrder.save();

    res.status(200).json({ status: 'success', orderNum: newOrder.orderNum });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error by creating an order', err });
  }
};
module.exports = orderController;
