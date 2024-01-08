var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var companyProducts = new mongoose.Schema({
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
module.exports = new mongoose.model('companyProducts', companyProducts);
