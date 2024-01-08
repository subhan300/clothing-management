const mongoose = require('mongoose');
const manager = new mongoose.Schema({
  name: { type: String, required: true },
  managerPassword: {
    type: String,
    required: true,
  },
  managerEmail: {
    type: String,
    required: true,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  managerPhone: {
    type: String,
    required: false,
  },
  companyName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
// eslint-disable-next-line new-cap
module.exports = new mongoose.model('manager', manager);
