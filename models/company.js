const mongoose = require('mongoose');
const Modal = mongoose.model;
const company = new mongoose.Schema({
  companyName: { type: String, require: true },
  companyEmail: { type: String, required: false },
  companyPhone: { type: String, required: false },
  companyFax: { type: String, required: false },
  companyLogo: { type: String, required: false },
  companyLocation: { type: String },
  pricingStatus: {
    type: Number,
    enum: [0, 1], // 0: No, 1: Yes
    required: 'Please specify at least one factor.',
  },
  budgetStatus: {
    type: Number,
    enum: [0, 1], // 0: No, 1: Yes
    required: 'Please specify at least one factor.',
  },
  pricing: {
    type: Number,
    required: false,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = new Modal('company', company);
