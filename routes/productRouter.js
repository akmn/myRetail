/* eslint-disable no-param-reassign */
const express = require('express');
const productsController = require('../controllers/productsController');

function routes(Product) {
  const productRouter = express.Router();
  const controller = productsController(Product);

  productRouter.route('/products')
    .get(controller.get);

  productRouter.route('/products/:productId')
    .get(controller.getItem)
    .put(controller.put);
  return productRouter;
}

module.exports = routes;
