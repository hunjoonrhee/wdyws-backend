const express = require('express');
const { authenticate, checkAdmin } = require('../controller/auth.controller');
const { addProductToCart, getCartList } = require('../controller/cart.controller');

const router = express.Router();

router.post('/', authenticate, addProductToCart);
router.get('/', authenticate, getCartList);

module.exports = router;
