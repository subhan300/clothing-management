const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Modal = mongoose.model;
const employeeProducts = new mongoose.Schema({
  products: {
    type: [
      {
        productName: String,
        productSize: String,
        productImage: String,
        productPrice: Number,
        productQuantity: Number,
      },
    ],
    required: true,
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'company',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = new Modal('employeeProducts', employeeProducts);
