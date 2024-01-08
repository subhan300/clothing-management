const mongoose = require('mongoose');
const Schema = mongoose.Schema;



// Define the counter schema
const counterSchema = new Schema({
  companyId: {
    type: String,
    required: true,
    unique: true,
  },
  value: {
    type: Number,
    required: true,
    default: 0,
  },
});


// Create the counter model
module.exports =new mongoose.model('Counter', counterSchema);
