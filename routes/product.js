const express = require('express');
const { authenticate, checkAdmin } = require('../controller/auth.controller');
const {
  createProduct,
  getProductBySKU,
  getAllProducts,
  deleteProduct,
  updateProduct,
} = require('../controller/product.controller');

const router = express.Router();

router.post('/', authenticate, checkAdmin, createProduct);
router.get('/:sku', authenticate, checkAdmin, getProductBySKU);
router.get('/', authenticate, checkAdmin, getAllProducts);
router.delete('/:sku', authenticate, checkAdmin, deleteProduct);
router.put('/:sku', authenticate, checkAdmin, updateProduct);

module.exports = router;
