const Employee = require("../models/employee");
const employeeProducts = require("../models/employeeProducts");

var mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const addProduct = async (req, res) => {
  let resProduct = req.body;
  console.log(resProduct)
  let empId = req.query.employeeId;

  try {
    let productId = await getEmployeeById(empId);
    let productAddedRes = await addProductById(productId, resProduct);
    res.status(200).send(productAddedRes);
  } catch (err) {
    res.status(400).send(err);
  }
};

const getEmployeeById = async (empId) => {
 
  try {
    const getEmployeeById = await Employee.findById(empId);
    if (!getEmployeeById) {
      return "error ";
      //   res.status(400).send({ message: 'ID not found' });
    } else {
      console.log("getemployees", getEmployeeById.productsId);
      return getEmployeeById.productsId;
      //   res.status(200).send(getEmployeeById);
    }
  } catch (error) {
    console.log(error);
    // res.send("Something went wrong").status(500);
    return error;
  }
};

async function addProductById(id, product) {
  console.log("id", id, "product", product);
  try {
    const result = await employeeProducts
      .findOneAndUpdate(
        { _id: id },
        { $push: { products: product } },
        { new: true }
      )
      .exec();
    console.log(result);
    return result;
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  addProduct,
};
