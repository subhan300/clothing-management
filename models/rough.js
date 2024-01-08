const mongoose = require('mongoose');
const Modal = mongoose.model;
const Product = new mongoose.Schema({
  productName: { type: String, required: true },
  productSize: {
    type: String,
    required: true
  },
  productImage: { type: String, required: true },
  productPrice: {
    type: String,
    required: true
  }
});

module.exports = new Modal('Product', Product);
