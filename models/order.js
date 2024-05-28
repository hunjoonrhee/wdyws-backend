const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const User = require('./user');
const Product = require('./product');

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    orderItems: [
      {
        productId: {
          type: mongoose.ObjectId,
          ref: Product,
          required: true,
        },
        size: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    shipTo: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.ObjectId,
      ref: User,
      required: true,
    },
  },
  { timestamps: true },
);

orderSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.updatedAt;
  delete obj.__v;

  return obj;
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
