var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var budgetRequest = new mongoose.Schema({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: 'employee'
  },
  requestAmount:{
    type:Number,
    required:true
  },
  approvedAmount:{
    type:Number,
    required:true
  },
  status: {
    type: Number,
    enum: [0, 1, 2], // 0: request, 1: accepted, 2: rejected
    required: 'Please specify at least one factor.',
  },
  
});
module.exports = new mongoose.model('budgetRequest', budgetRequest);