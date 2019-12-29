const mongoose = require('mongoose');

const { Schema } = mongoose;

const productModel = new Schema(
  {
    _id: Number,
    current_price: {
      value: { type: Number },
      currency_code: { type: String }
    }
  }
);

module.exports = mongoose.model('Product', productModel);
