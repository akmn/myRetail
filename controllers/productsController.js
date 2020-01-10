/* eslint-disable no-underscore-dangle */
const request = require('request-promise');

function productsController(Product) {
  function get(req, res) {
    const query = {};
    Product.find(query, (err, products) => {
      if (err) {
        return res.send(err);
      }
      const returnProducts = products.map((product) => {
        const newProduct = {};
        newProduct.id = product._id;
        newProduct.current_price = product.current_price;
        newProduct.links = {};
        newProduct.links.self = `http://${req.headers.host}/api/products/${newProduct.id}`;
        return newProduct;
      });

      return res.send(returnProducts);
    });
  }
  function getItem(req, res) {
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
      return res;
    });
  }
  function put(req, res) {
    const product = {};
    product.current_price = req.body.current_price;
    Product.findById(req.params.productId, (err, putProduct) => {
      if (err) return res.status(500).send(err);
      if (!putProduct) {
        return res.sendStatus(404);
      }
      if (!req.body.current_price
        || !req.body.current_price.value
        || !req.body.current_price.currency_code) {
        return res.status(400).send('Invalid entry received for current_price.  Please specify a value and currency_code.');
      }
      // eslint-disable-next-line no-restricted-globals
      if (isNaN(req.body.current_price.value)) {
        return res.status(400).send('Invalid entry received for current_price.  Please specify a numeric value.');
      }
      if (!(req.body.current_price.currency_code === 'USD')) {
        return res.status(400).send('Invalid entry received for current_price.  The only allowable currency_code is USD.');
      }
      // eslint-disable-next-line no-param-reassign
      putProduct.current_price = req.body.current_price;
      putProduct.save();

      const returnProduct = {};
      returnProduct.id = product._id;
      returnProduct.current_price = product.current_price;
      returnProduct.links = {};
      returnProduct.links.allproducts = `http://${req.headers.host}/api/products`;
      return res.json(returnProduct);
    });
  }

  return { get, getItem, put };
}

module.exports = productsController;
