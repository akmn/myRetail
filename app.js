const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

if (process.env.ENV === 'Test') {
  mongoose.connect('mongodb://localhost/myRetailProducts-test');
} else {
  mongoose.connect('mongodb://localhost/myRetailProducts');
}

const port = process.env.PORT || 3000;
const Product = require('./models/productModel');
const productRouter = require('./routes/productRouter')(Product);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', productRouter);
app.get('/', (req, res) => {
  res.send('myRetail API');
});

app.server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Running on port ${port}`);
});

module.exports = app;
