const express = require('express');
const Cart = require('../models/cart');
const Product = require('../models/product');
const User = require('../models/user');
const Order = require('../models/order');
const orderController = {};
const mongoose = require('mongoose');
const productConrtoller = require('./product.controller');
const RandomStringGenerator = require('../utils/randomStringGenerator');

const PAGE_SIZE = 4;

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

orderController.getOrderList = async (req, res) => {
  try {
    const { page, orderNum } = req.query;
    const cond = orderNum ? { orderNum: { $regex: orderNum, $options: 'i' } } : {};
    let query = Order.find(cond)
      .populate({
        path: 'orderItems',
        populate: {
          path: 'productId',
          model: 'Product',
        },
      })
      .populate({
        path: 'userId',
        model: 'User',
      });
    let response = { status: 'success' };
    if (page) {
      query.skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE);
      const totalItemNum = await Order.find(cond).count();
      const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
      response.totalPageNum = totalPageNum;
      response.pageSize = PAGE_SIZE;
    }
    const order = await query.exec();
    response.data = order;
    if (!order) {
      return res.status(404).json({ message: 'order not found!' });
    }
    if (req.isAdmin) {
      return res.status(200).json({ response });
    } else {
      return res.status(403).json({ message: 'permission denied!' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error by getting all order lists', err });
  }
};
orderController.getMyOrderList = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'user not found!' });
    }
    const order = await Order.findOne({ userId: userId }).populate({
      path: 'orderItems',
      populate: {
        path: 'productId',
        model: 'Product',
      },
    });
    if (!order) {
      return res.status(404).json({ message: 'order not found!' });
    }
    const myOrderList = order.orderItems;
    return res.status(200).json({ status: 'success', myOrderList });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error by getting user order list', err });
  }
};
module.exports = orderController;
