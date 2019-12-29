const request = require('request');
const async = require('async');

function productsController(Product) {
  function post(req, res) {
    const product = new Product(req.body);
    // TODO: Business validation on post
    // if (!req.body.title) {
    //   res.status(400);
    //   return res.send('Title is required');
    // }
    product.save();
    res.status(201);
    return res.json(product);
  }

  function get(req, res) {
    const query = {};
    // TODO: Filtering
    // if (req.query.genre) {
    //   query.genre = req.query.genre;
    // }
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

      res.send(returnProducts);

      // getProductNames(returnProducts, res);
    });
  }

  return { post, get };
}

function getProductNames(products, res) {
  const promises = products.map(async product => {
    const url = `http://redsky.target.com/v2/pdp/tcin/${product.id}?excludes=taxonomy,price,promotion,bulk_ship,rating_and_review_reviews,rating_and_review_statistics,question_answer_statistics`;
    request(url).then((response) => {
      const newProduct = JSON.parse(JSON.stringify(product));
      newProduct.name = JSON.parse(response).product.item.product_description.title;
      console.log(newProduct);
      return Promise.resolve(newProduct);
    });
  });
  console.log(promises);
  Promise.all(promises).then((val) => {
    console.log(val);
  });
}

module.exports = productsController;
