const mongoose = require('mongoose');
const Model = mongoose.model;
const admin = new mongoose.Schema({
  adminPassword: {
    type: String,
    required: true
  },
  adminEmail: {
    type: String,
    required: true
  },
    name: {
    type: String,
    required: true
  }
});
module.exports = new Model('admin', admin);
