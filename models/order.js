const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const User = require('./user');
const Product = require('./product');
const Cart = require('./cart');

const orderSchema = new mongoose.Schema(
  {
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
    status: {
      type: String,
      default: 'preparing',
    },
    totalPrice: { type: Number, required: true, default: 0 },
    orderNum: { type: String },
    shipTo: {
      type: Object,
      required: true,
    },
    contact: {
      type: Object,
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

orderSchema.post('save', async function () {
  const cart = await Cart.findOne({ userId: this.userId });
  cart.cartItems = [];
  await cart.save();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
