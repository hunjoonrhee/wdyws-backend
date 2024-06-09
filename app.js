const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const userRouter = require('./routes/user');
const productRouter = require('./routes/product');
const cartRouter = require('./routes/cart');
const orderRouter = require('./routes/order');
const session = require('express-session');

const app = express();

dotenv.config();

app.use(bodyParser.json());

app.use(
  cors({
    origin: ['http://localhost:3000', 'https://whatdoyouwannashopping.netlify.app'],
    credentials: true,
  }),
);

app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
    cookie: { secure: true },
  }),
);

const MONGODB_URI = process.env.NODE_ENV === 'production' ? process.env.MONGODB_URI_PROD : process.env.MONGODB_URI_DEV;
console.log(MONGODB_URI);
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('mongoose connected');
  })
  .catch((err) => {
    console.log('mongoose connection failed', err);
  });

app.get('/', (req, res) => {
  res.send('Hello Joon');
});

app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

app.listen(process.env.PORT || 5002, () => {
  console.log('server started and listening port 5002');
});
