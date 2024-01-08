var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var employee = new mongoose.Schema({
  employeeName: {
    type: String,
    required: true,
  },
  employeePassword: {
    type: String,
    required: false,
  },
  budgetStatus: {
    type: Number,
    enum: [0, 1], // 0: false, 1: true
    required: true,
    default: 0, // Set a default value for budgetStatus
  },
  gender: {
    type: String,
    enum: ['M', 'F'],
    required: true,
  },
  employeeEmail: {
    type: String,
    required: false,
  },
  companyName: {
    type: String,
    required: true,
  },
  employeePhone: {
    type: String,
    required: false,
  },
  budget: {
    type: Number,
    required: false,
    default: 0,
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'employeeProducts',
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
module.exports = new mongoose.model('employee', employee);
