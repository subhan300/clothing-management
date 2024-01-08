const mongoose = require('mongoose');
const Modal = mongoose.model;
const Schema = mongoose.Schema;
const orders = new mongoose.Schema({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: 'employee',
  },
  name: { type: String },
  employeeName: { type: String },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'company',
  },
  role: {
    type: String,
  },
  products: {
    type: [
      {
        _id: false,
        productName: String,
        productSize: String,
        productImage: String,
        productPrice: Number,
        productQuantity: Number,
      },
    ],
    default: [], // default value is an empty array
  },
  bill: { type: Number },
  quantity: { type: Number },
  companyName: {
    type: String,
  },
  comment: {
    type: String,
  },
  invoice: {
    type: String,
  },
  managerOrder: {
    type: [{}],
    default: [], // default value is an empty array
  },
  createdAt: {
    type: String,
  },
});
module.exports = new Modal('orders', orders);
