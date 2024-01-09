const company = require('../models/company');
const employeeProduct = require('../models/employeeProducts');
const Employee = require('../models/employee');
const employee = require('../models/employee');
const { sendEmail } = require('../global-functions/GlobalFunctions');
const addEmployees = async (req, res) => {
  try {
    const {
      employeeName,
      employeePassword,
      employeeEmail,
      gender,
      companyName,
      employeePhone,
      companyId,
      products,
 
    } = req.body;

    const productsArray = products.map((product) => {
      const { productName, productSize, productImage, productPrice } = product;
      return {
        productName,
        productSize,
        productImage,
        productPrice,
      };
    });

    const employeeProductObj = {
      products: productsArray,
      companyId: companyId,
    };

    const createdEmployeeProducts = await employeeProduct.create([employeeProductObj]);
    const employeeObj = {
      productId: createdEmployeeProducts[0]._id,
      employeeName: employeeName,
      employeePassword: employeePassword,
      employeeEmail: employeeEmail,
      gender: gender,
      budget: 0,
      companyName: companyName,
      employeePhone: employeePhone,
      companyId: companyId,
    };
    const getCompany = await company.findById(companyId);
    if (!getCompany) {
      return res.status(400).send('Company not found');
    }
    const existingEmployee = await employee.findOne({ employeeEmail: employeeEmail })
    // .hint({ employeeEmail: 1 });
    console.log("exiting email",existingEmployee)
    if (existingEmployee && employeeEmail) {
      return res.status(400).send('Employee already exist!');
    }
    const newEmployee = await Employee.create([employeeObj]);
    if (newEmployee) {
      let budgetStatus;
      let budget;
      if (getCompany.pricingStatus === 0) {
        budgetStatus = 0;
        budget = 0;
      } else if (getCompany.budgetStatus === 1) {
        budgetStatus = 1;
        budget = getCompany.pricing;
      }
      // Update the budgetStatus using the newly created employee's _id
      const updatedRequest = await Employee.findOneAndUpdate(
        { _id: newEmployee[0]._id },
        { $set: { budgetStatus, budget } },
        { new: true },
      );
      console.log("updated request",updatedRequest)
      res.status(200).send({
        employee: updatedRequest,
        products: createdEmployeeProducts,
        message: 'New employee has been added!',
      });
    } else {
      // Handle any error that occurred during employee creation
      res.status(500).send('Failed to create a new employee.');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Something went wrong!',
      error,
    });
  }
};
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeName, employeePassword, employeeEmail, gender, budget, employeePhone } = req.body;

    // Create an object with the updated employee data
    const updatedEmployee = {
      employeeName,
      employeePassword,
      employeeEmail,
      employeePhone,
      gender,
      budget,
    };
    // Find the employee by ID and update their record
    const employee = await Employee.findByIdAndUpdate(id, updatedEmployee, {
      new: true,
    });
    if (!employee) {
      // If no employee is found with the given ID, return an error response
      return res.status(404).send({
        message: 'Employee not found!',
      });
    }
    if(employeePassword){
      let mailOptions = {
        from: 'subhan.akram1971@gmail.com',
        to: employeeEmail,
        subject: `Neue Zugangsdaten - Mitarbeiter`,
        text: `Willkommen!

        Hier sind deine Zugangsdaten:

        E-Mail: ${employeeEmail}
        Passwort: ${employeePassword}
        
        Zum Einloggen, besuche: subhan.akram1971@gmail.com
        
        Bei Problemen, kontaktiere unser Support-Team: subhan.akram1971@gmail.com.
        
        Vielen Dank, dass du dabei bist!

        Beste Grüße,
        Stick 77`,
      };
      sendEmail(mailOptions);
    }
    res.status(200).send({
      result: employee,
      message: 'Employee record has been updated!',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Something went wrong!',
      error,
    });
  }
};
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params; // Get the product ID from the request parameters

    const result = await Employee.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).send({
        message: 'Employee not found!',
      });
    }
    res.status(200).send({
      message: 'Employee has been deleted!',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Something went wrong!',
      error,
    });
  }
};

const { ObjectId } = require('mongoose').Types;

const getEmployeeByCompany = async (req, res) => {
  const companyId = req.query.companyId;

  try {
    if (!ObjectId.isValid(companyId)) {
      return res.status(400).send('Invalid company ID');
    }

    const getEmployees = await Employee.find({ companyId });

    if (getEmployees.length === 0) {
      return res.status(404).send('No employees found for the company');
    }

    res.status(200).send(getEmployees);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong');
  }
};

module.exports = getEmployeeByCompany;

const totalEmployee = async (req, res) => {
  try {
    const { companyId } = req.query;
    let pipeline = [
      {
        $count: 'totalEmployee',
      },
    ];
    if (companyId) {
      pipeline = [
        {
          $match: { companyId: new ObjectId(companyId) },
        },
        ...pipeline,
      ];
    }
    const getTotalEmployee = await Employee.aggregate(pipeline);
    res.status(200).send(getTotalEmployee);
  } catch (error) {
    console.log(error);
    res.send('Something went wrong').status(500);
  }
};
const getEmployee = async (req, res) => {
  try {
    const managers = await Employee.find(); // Query the database to retrieve all the managers
    res.status(200).send(managers); // Return a 200 response with the managers array
  } catch (error) {
    res.status(500).send('Something went wrong'); // If there was an error during the database query, return a 500 response
  }
};
module.exports = {
  addEmployees,
  updateEmployee,
  deleteEmployee,
  getEmployeeByCompany,
  totalEmployee,
  getEmployee,
};
