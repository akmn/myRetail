const should = require('should');
const sinon = require('sinon');
const productsController = require('../controllers/productsController');

describe('Product Controller Tests', () => {
  describe('Get', () => {
    it('should return a list of products', () => {
      const Product = function (product) { };
      const req = {}

      const res = {
        status: sinon.spy(),
        send: sinon.spy(),
        json: sinon.spy()
      };

      const controller = productsController(Product);
      controller.get(req, res);
      // res.status.calledWith(400).should.equal(true, `Bad Status ${res.status.args[0][0]}`);
    });
  });
});
