const express = require('express');
const { authenticate } = require('../controller/auth.controller');
const { createProduct } = require('../controller/product.controller');

const router = express.Router();

router.post('/', authenticate, createProduct);
// router.get('/:productId', authenticate, getProductById);
// router.get('/', authenticate, getAllProducts);

module.exports = router;
