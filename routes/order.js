const express = require('express');
const { authenticate } = require('../controller/auth.controller');
const { createOrder } = require('../controller/order.controller');

const router = express.Router();

router.post('/', authenticate, createOrder);

module.exports = router;
