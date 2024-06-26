const express = require('express');
const Product = require('../models/product');
const productController = {};

const PAGE_SIZE = 4;

productController.createProduct = async (req, res) => {
  try {
    const isAdmin = req.isAdmin;
    if (!isAdmin) {
      return res.status(403).json({ message: 'permission denied' });
    }

    const { sku, name, description, price, image, stock, category, status, isDeleted } = req.body;
    const exProduct = await Product.findOne({ sku: sku });
    if (exProduct) {
      return res.status(403).send('already existing product!');
    }
    const newProduct = new Product({ sku, name, description, price, image, stock, category, status, isDeleted });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error by creating product', err });
  }
};

productController.getProductBySKU = async (req, res) => {
  try {
    const sku = req.params.sku;
    const product = await Product.findOne({ sku: sku });
    if (!product) {
      return res.status(404).send('product not found or unknown sku!');
    }
    if (req.isGuest || !req.isAdmin) {
      if (product.isDeleted || product.status === 'inactive') {
        return res.status(400).json({ message: 'this product is deleted or inactive' });
      }
      return res.status(200).json(product);
    }
    if (req.isAdmin) {
      return res.status(200).json(product);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error by getting product', err });
  }
};

productController.getAllProducts = async (req, res) => {
  try {
    const { page, name } = req.query;
    const cond = name ? { name: { $regex: name, $options: 'i' } } : {};
    let query = Product.find(cond);
    let response = { status: 'success' };
    if (page) {
      query.skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE);
      const totalItemNum = await Product.find(cond).count();
      const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
      response.totalPageNum = totalPageNum;
      response.pageSize = PAGE_SIZE;
    }
    const products = await query.exec();
    response.data = products;
    if (!products) {
      return res.status(404).json({ message: 'No products are found!' });
    }
    if (req.isGuest || !req.isAdmin) {
      let productsForNotAdmin;
      productsForNotAdmin = products.filter((p) => !p.isDeleted && p.status === 'active');
      response.data = productsForNotAdmin;
      return res.status(200).json(response);
    }

    if (req.isAdmin) {
      return res.status(200).json(response);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error by getting product', err });
  }
};
productController.deleteProduct = async (req, res) => {
  try {
    const isAdmin = req.isAdmin;
    if (!isAdmin) {
      return res.status(403).json({ message: 'permission denied' });
    }
    const productSku = req.params.sku;
    const product = await Product.findOne({ sku: productSku });
    if (!product) {
      return res.status(404).send('product not found');
    }
    await Product.deleteOne({ sku: productSku });
    res.status(200).json({ message: 'product is successfully deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error by deleting product', err });
  }
};

productController.updateProduct = async (req, res) => {
  try {
    const isAdmin = req.isAdmin;
    if (!isAdmin) {
      return res.status(403).json({ message: 'permission denied' });
    }

    const productSku = req.params.sku;
    const editData = req.body;

    const product = await Product.findOneAndUpdate({ sku: productSku }, editData, { new: true });
    if (!product) {
      return res.status(404).send('product not found');
    }

    await product.save();
    res.status(201).json({ status: 'success', data: product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error by editing product', err });
  }
};

productController.checkStock = async (item) => {
  const product = await Product.findById(item.productId);
  if (product.stock[item.size] < item.quantity) {
    return {
      isVerify: false,
      message: `We are out of stock for the Size ${item.size} for ${product.name}`,
    };
  }
  const newStock = { ...product.stock };
  newStock[item.size] -= item.quantity;
  product.stock = newStock;

  await product.save();
  return { isVerify: true };
};

productController.checkItemListStock = async (itemList) => {
  const insufficientStockItems = [];

  await Promise.all(
    itemList.map(async (item) => {
      const stockCheck = await productController.checkStock(item);
      if (!stockCheck.isVerify) {
        insufficientStockItems.push({ item, message: stockCheck.message });
      }
      return stockCheck;
    }),
  );
  return insufficientStockItems;
};

module.exports = productController;
