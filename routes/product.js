const express = require('express');
const { authenticate, checkAdmin } = require('../controller/auth.controller');
const { createProduct, getProductBySKU, getAllProducts, deleteProduct } = require('../controller/product.controller');

const router = express.Router();

router.post('/', authenticate, checkAdmin, createProduct);
router.get('/:sku', authenticate, checkAdmin, getProductBySKU);
router.get('/', authenticate, checkAdmin, getAllProducts);
router.delete('/:sku', authenticate, checkAdmin, deleteProduct);

module.exports = router;
