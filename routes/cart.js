const express = require('express');
const { authenticate, checkAdmin } = require('../controller/auth.controller');
const { addProductToCart, getCartList, deleteProduct, updateProductAmount } = require('../controller/cart.controller');

const router = express.Router();

router.post('/', authenticate, addProductToCart);
router.get('/', authenticate, getCartList);
router.delete('/', authenticate, deleteProduct);
router.put('/', authenticate, updateProductAmount);

module.exports = router;
