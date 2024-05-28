const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const User = require('./user');
const Product = require('./product');

const cartSchema = new mongoose.Schema(
  {
    cartId: {
      type: String,
      required: true,
    },
    cartItems: [
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
      },
    ],
    userId: {
      type: mongoose.ObjectId,
      ref: User,
      required: true,
    },
  },
  { timestamps: true },
);

cartSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.updatedAt;
  delete obj.__v;

  return obj;
};

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
