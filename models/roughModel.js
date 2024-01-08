var mongoose = require("mongoose");

var Product = new mongoose.Schema({
  product: {
    type: [
      {
        productName: String,
        productSize: String,
        productImage: String,
        productPrice: Number,
      },
    ],
    required: true,
  },
});

module.exports = new mongoose.model("Product", Product);
