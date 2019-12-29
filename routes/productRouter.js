/* eslint-disable no-param-reassign */
const express = require('express');
const productsController = require('../controllers/productsController');
const request = require('request-promise');

function routes(Product) {
  const productRouter = express.Router();
  const controller = productsController(Product);

  productRouter.route('/products')
    .post(controller.post)
    .get(controller.get);

  productRouter.route('/products/:productId')
    .get((req, res) => {
      Product.findById(req.params.productId, (err, product) => {
        if (err) {
          return res.send(err);
        }
        if (product) {
          const returnProduct = {};
          returnProduct.id = product._id;
          returnProduct.current_price = product.current_price;

          returnProduct.links = {};
          returnProduct.links.allproducts = `http://${req.headers.host}/api/products`;

          const url = `http://redsky.target.com/v2/pdp/tcin/${returnProduct.id}?excludes=taxonomy,price,promotion,bulk_ship,rating_and_review_reviews,rating_and_review_statistics,question_answer_statistics`;

          request(url).then((result) => {
            returnProduct.name = JSON.parse(result).product.item.product_description.title;
            return res.json(returnProduct);
          });
        } else {
          return res.sendStatus(404);
        }
      });

    })

    .put((req, res) => {
      const product = {};
      product.current_price = req.body.current_price;
      Product.findById(req.params.productId, (err, product) => {
        if (err) return res.status(500).send(err);
        if (!req.body.current_price || !req.body.current_price.value || !req.body.current_price.currency_code) {
          return res.status(400).send('Invalid entry received for current_price.  Please specify a value and currency_code.');
        }
        if (isNaN(req.body.current_price.value)) {
          return res.status(400).send('Invalid entry received for current_price.  Please specify a numeric value.');
        }
        if (!(req.body.current_price.currency_code === 'USD')) {
          return res.status(400).send('Invalid entry received for current_price.  The only allowable currency_code is USD.');
        }
        product.current_price = req.body.current_price;
        /*TODO: 
        Move Router logic to controller and and unit tests
        Add integration tests
        Add readme 
        */
        product.save();

        const returnProduct = {};
        returnProduct.id = product._id;
        returnProduct.current_price = product.current_price;
        returnProduct.links = {};
        returnProduct.links.allproducts = `http://${req.headers.host}/api/products`;
        return res.json(returnProduct);
      });
    });
  return productRouter;
}




module.exports = routes;