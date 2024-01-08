const mongoose = require('mongoose');
const ObjectId =
  mongoose.Types.ObjectId;
const employeeProduct = require('../models/employeeProducts');
const companyProducts = require('../models/companyProducts');
const company = require('../models/company');
const allProducts = require('../models/allProducts');
const employee = require('../models/employee');
const addProducts = async (
  req,
  res,
) => {
  const products = req.body;
  console.log(products, 'products');
  try {
    const productArr = [];
    for (
      let i = 0;
      i < products.length;
      i++
    ) {
      // Create the product object
      const productObj = {
        productName:
          products[i].productName,
        productImage:
          products[i].productImage,
      };
      productArr.push(productObj);
    }
    const newProducts =
      await allProducts.insertMany(
        productArr,
      );
    res.status(200).send({
      result: newProducts,
      message:
        'Products have been created successfully!',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Something went wrong!',
      error: error.message,
    });
  }
};
const updateProduct = async (
  req,
  res,
) => {
  try {
    const { id } = req.params;
    const {
      productName,
      productImage,
    } = req.body;

    const existingProduct =
      await allProducts.findOne({
        _id: id,
      });
    if (!existingProduct) {
      return res.status(404).send({
        message: 'Product not found!',
      });
    }
    // Update the product properties with the provided values or use the default values from the existing product
    const updatedProductName =
      productName ||
      existingProduct.productName;
    const updatedProductImage =
      productImage ||
      existingProduct.productImage;

    // Perform the update operation
    const products =
      await allProducts.findOneAndUpdate(
        {
          _id: id,
        },
        {
          $set: {
            productName:
              updatedProductName,
            productImage:
              updatedProductImage,
          },
        },
        { new: true },
      );

    res.status(200).send({
      result: products,
      message:
        'Product has been updated!',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Something went wrong!',
      error,
    });
  }
};
const deleteProduct = async (
  req,
  res,
) => {
  try {
    const { id } = req.params;

    const getProduct =
      await allProducts.findOneAndDelete(
        {
          _id: id,
        },
      );
    if (!getProduct) {
      return res.status(404).send({
        message: 'Product not found!',
      });
    }
    res.status(200).send({
      message:
        'Product has been deleted!',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Something went wrong!',
      error,
    });
  }
};
const updateCompanyProduct = async (
  req,
  res,
) => {
  try {
    const id = req.params.id;
    const productArr = req.body;
    const updatedProducts = [];
    const findCompany =
      await companyProducts.find({
        companyId: id,
      });
    if (findCompany.length === 0) {
      return res.status(404).send({
        message:
          'Sorry, company not found',
      });
    }
    for (
      let i = 0;
      i < productArr.length;
      i++
    ) {
      const existingProduct =
        await companyProducts.find({
          'products._id':
            productArr[i]._id,
        });
      if (
        existingProduct.length === 0
      ) {
        return res.status(404).send({
          message: `Product with ID ${productArr[i]._id} not found!`,
        });
      }
      const updatedProductName =
        productArr[i].productName ||
        existingProduct.productName;
      const updatedProductSize =
        productArr[i].productSize ||
        existingProduct.productSize;
      const updatedProductImage =
        productArr[i].productImage ||
        existingProduct.productImage;
      const updatedProductPrice =
        productArr[i].productPrice ||
        existingProduct.productPrice;
      const updatedProductQuantity =
        productArr[i].productQuantity ||
        existingProduct.ProductQuantity;
      const product =
        await companyProducts.findOneAndUpdate(
          {
            'products._id':
              productArr[i]._id,
          },
          {
            $set: {
              'products.$.productName':
                updatedProductName,
              'products.$.productSize':
                updatedProductSize,
              'products.$.productImage':
                updatedProductImage,
              'products.$.productPrice':
                updatedProductPrice,
              'products.$.productQuantity':
                updatedProductQuantity,
            },
          },
          { new: true },
        );
      updatedProducts.push(product);
    }
    console.log(
      updatedProducts,
      'updatedProducts',
    );
    res.status(200).send({
      results: updatedProducts,
      message:
        'Products have been updated!',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Something went wrong!',
      error,
    });
  }
};
const updateEmployeeProduct = async (
  req,
  res,
) => {
  try {
    const id = req.params.id;
    const productArr = req.body;
    const updatedProducts = [];
    const findCompany =
      await employeeProduct.find({
        companyId: id,
      });
    if (findCompany.length === 0) {
      return res.status(404).send({
        message:
          'Sorry, company not found',
      });
    }
    for (
      let i = 0;
      i < productArr.length;
      i++
    ) {
      const existingProduct =
        await employeeProduct.find({
          'products._id':
            productArr[i]._id,
        });
      if (
        existingProduct.length === 0
      ) {
        return res.status(404).send({
          message: `Product with ID ${productArr[i]._id} not found!`,
        });
      }
      const updatedProductName =
        productArr[i].productName ||
        existingProduct.productName;
      const updatedProductSize =
        productArr[i].productSize ||
        existingProduct.productSize;
      const updatedProductImage =
        productArr[i].productImage ||
        existingProduct.productImage;
      const updatedProductPrice =
        productArr[i].productPrice ||
        existingProduct.productPrice;
      const updatedProductQuantity =
        productArr[i].productQuantity ||
        existingProduct.ProductQuantity;
      const product =
        await employeeProduct.findOneAndUpdate(
          {
            'products._id':
              productArr[i]._id,
          },
          {
            $set: {
              'products.$.productName':
                updatedProductName,
              'products.$.productSize':
                updatedProductSize,
              'products.$.productImage':
                updatedProductImage,
              'products.$.productPrice':
                updatedProductPrice,
              'products.$.productQuantity':
                updatedProductQuantity,
            },
          },
          { new: true },
        );
      updatedProducts.push(product);
    }
    console.log(
      updatedProducts,
      'updatedProducts',
    );
    res.status(200).send({
      results: updatedProducts,
      message:
        'Products have been updated!',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Something went wrong!',
      error,
    });
  }
};
const addCompanyProduct = async (
  req,
  res,
) => {
  try {
    const companyId = req.params.id;
    const productArr = req.body;
    const updatedProducts = [];
    for (
      let i = 0;
      i < productArr.length;
      i++
    ) {
      const productData = productArr[i];

      const updatedProduct = {
        productName:
          productData.productName || '',
        productSize:
          productData.productSize || '',
        productImage:
          productData.productImage ||
          '',
        productPrice:
          productData.productPrice || 0,
        productQuantity:
          productData.productQuantity ||
          0,
      };
      updatedProducts.push(
        updatedProduct,
      );
    }
    const updatedCompany =
      await companyProducts.findOneAndUpdate(
        { companyId },
        {
          $push: {
            products: {
              $each: updatedProducts,
            },
          },
        },
        { new: true },
      );
    res.status(200).send({
      results: productArr,
      message:
        'Products have been added!',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Something went wrong!',
      error,
    });
  }
};
const addEmployeeProduct = async (
  req,
  res,
) => {
  try {
    const _id = req.params.id;
    const productArr = req.body;
    const updatedProducts = [];
    for (
      let i = 0;
      i < productArr.length;
      i++
    ) {
      const productData = productArr[i];

      const updatedProduct = {
        productName:
          productData.productName || '',
        productSize:
          productData.productSize || '',
        productImage:
          productData.productImage ||
          '',
        productPrice:
          productData.productPrice || 0,
        productQuantity:
          productData.productQuantity ||
          0,
      };
      updatedProducts.push(
        updatedProduct,
      );
    }
    const updatedCompany =
      await employeeProduct.findOneAndUpdate(
        { _id },
        {
          $push: {
            products: {
              $each: updatedProducts,
            },
          },
        },
        { new: true },
      );
    res.status(200).send({
      results: productArr,
      message:
        'Products have been added!',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Something went wrong!',
      error,
    });
  }
};

const getProductsByEmployeeId = async (
  req,
  res,
) => {
  const employeeId =
    req.query.employeeId;
  try {
    const employeeProducts =
      await employee.aggregate([
        {
          $match: {
            _id: new ObjectId(
              employeeId,
            ),
          },
        },
        {
          $lookup: {
            from: 'employeeproducts',
            localField: 'productsId',
            foreignField: '_id',
            as: 'products',
          },
        },
        {
          $project: {
            employeePassword: 0,
            companyName: 0,
            companyId: 0,
            productsId: 0,
          },
        },
      ]);
    res
      .status(200)
      .send(employeeProducts);
  } catch (error) {
    res
      .send('Something went wrong')
      .status(500);
  }
};
const getAllEmployeeProducts = async (
  req,
  res,
) => {
  try {
    const products =
      await employee.aggregate([
        {
          $lookup: {
            from: 'employeeproducts',
            localField: 'productsId',
            foreignField: '_id',
            as: 'result',
          },
        },
        {
          $project: {
            employeePassword: 0,
            productsId: 0,
          },
        },
      ]);
    res.status(200).send(products);
  } catch (error) {
    console.log(error);
    res
      .send('Something went wrong')
      .status(500);
  }
};
const getEmployeeProductByCompanyId =
  async (req, res) => {
    const companyId =
      req.query.companyId;
    console.log("run");
    try {
      const products =
        await company.aggregate([
          {
            $match: {
              _id: new ObjectId(
                companyId,
              ),
            },
          },
          {
            $lookup: {
              from: 'employeeproducts',
              localField: '_id',
              foreignField: 'companyId',
              as: 'products',
            },
          },
          {
            $lookup: {
              from: 'employees',
              localField: '_id',
              foreignField: 'companyId',
              as: 'employees',
            },
          },
          {
            $project: {
              'employees.employeePassword': 0,
              'employees.productsId': 0,
              'employees.companyId': 0,
            },
          },
        ]);
        console.log("products",products)
      return res
        .status(200)
        .send(products);
    } catch (error) {
      console.log(error);
      res
        .send('Something went wrong')
        .status(500);
    }
  };
const getProductsByCompanyId = async (
  req,
  res,
) => {
  const companyId = req.query.companyId;
  try {
    const getProductsByCompanyId =
      await companyProducts.findOne({
        companyId,
      });
    console.log(getProductsByCompanyId);
    if (!getProductsByCompanyId) {
      res.status(400).send({
        message: 'Product not found',
      });
    } else {
      res.send(getProductsByCompanyId);
    }
  } catch (error) {
    console.log(error);
    res
      .send('Something went wrong')
      .status(500);
  }
};
const getAllProducts = async (
  req,
  res,
) => {
  try {
    const getProductsCollection =
      await allProducts.find();
    console.log(getProductsCollection);
    if (!getProductsCollection) {
      res.status(400).send({
        message: 'Product not found',
      });
    } else {
      res.send(getProductsCollection);
    }
  } catch (error) {
    console.log(error);
    res
      .send('Something went wrong')
      .status(500);
  }
};
const deleteCompanyProduct = async (
  req,
  res,
) => {
  try {
    const { id } = req.params;
    const getProduct =
      await companyProducts.findOneAndUpdate(
        { 'products._id': id },
        {
          $pull: {
            products: { _id: id },
          },
        },
      );
    if (!getProduct) {
      return res.status(404).send({
        message: 'Product not found!',
      });
    }
    res.status(200).send({
      message:
        'Product has been deleted!',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Something went wrong!',
      error,
    });
  }
};
const deleteEmployeeProduct = async (
  req,
  res,
) => {
  try {
    const { id } = req.params; // Get the product ID from the request parameters
    //find ID in companyProducts field
    const getProduct =
      await employeeProduct.findOneAndUpdate(
        { 'products._id': id },
        {
          $pull: {
            products: { _id: id },
          },
        },
      );
    if (!getProduct) {
      return res.status(404).send({
        message: 'Product not found!',
      });
    }
    res.status(200).send({
      message:
        'Product has been deleted!',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Something went wrong!',
      error,
    });
  }
};

module.exports = {
  getAllEmployeeProducts,
  updateProduct,
  deleteProduct,
  updateCompanyProduct,
  updateEmployeeProduct,
  deleteCompanyProduct,
  deleteEmployeeProduct,
  getEmployeeProductByCompanyId,
  getProductsByCompanyId,
  getProductsByEmployeeId,
  getAllProducts,
  addProducts,
  addCompanyProduct,
  addEmployeeProduct,
};
