var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var allProducts = new mongoose.Schema({
  productName: { type: String, require: true },
  productImage: { type: String, require: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = new mongoose.model('allProducts', allProducts);
