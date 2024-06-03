const express = require('express');
const { authenticate } = require('../controller/auth.controller');
const { createProduct, getProductBySKU, getAllProducts } = require('../controller/product.controller');

const router = express.Router();

router.post('/', authenticate, createProduct);
router.get('/:sku', authenticate, getProductBySKU);
router.get('/', authenticate, getAllProducts);

module.exports = router;
