const express = require('express');
const { authenticate, checkAdmin } = require('../controller/auth.controller');
const { createOrder, getOrderList, getMyOrderList, updateOrderStatus } = require('../controller/order.controller');

const router = express.Router();

router.post('/', authenticate, createOrder);
router.get('/', authenticate, checkAdmin, getOrderList);
router.get('/me', authenticate, getMyOrderList);
router.put('/:orderId', authenticate, checkAdmin, updateOrderStatus);

module.exports = router;
