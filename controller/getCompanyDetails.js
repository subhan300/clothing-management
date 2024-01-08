const Company = require('../models/company');
const mongoose = require('mongoose');
const CompanyProducts = require('../models/companyProducts');
const Employee = require('../models/employee');
const Manager = require('../models/manager');
const addCompany = async (req, res) => {
  try {
    const {
      companyName,
      companyEmail,
      companyPhone,
      companyFax,
      companyLogo,
      companyLocation,
      budgetStatus,
      pricingStatus,
      pricing,
      status,
      products,
    } = req.body;
    let productsArr = [];
    const companyObj = {
      companyName: companyName,
      companyPhone: companyPhone,
      companyEmail: companyEmail,
      companyFax: companyFax,
      companyLogo: companyLogo,
      companyLocation: companyLocation,
      budgetStatus: budgetStatus,
      pricing: pricing,
      pricingStatus: pricingStatus,
      status: status,
    };
    if (companyObj.pricingStatus === 0) {
      companyObj.budgetStatus = 0;
    }
    const newCompany = await Company.create(companyObj);
    const _id = newCompany._id;
    productsArr.push({
      products: products,
      companyId: _id,
    });
    const newProducts = await CompanyProducts.create(productsArr);
    res.status(200).send({
      result: newCompany,
      products: newProducts,
      message: 'New Company has been added!',
    });
  } catch (error) {
    res.status(500).send({
      message: 'Something went wrong!',
      error,
    });
  }
};
const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      companyName,
      companyEmail,
      companyPhone,
      companyFax,
      companyLogo,
      companyLocation,
      pricing,
      pricingStatus,
      budgetStatus,
      status,
    } = req.body;
    // Create an object with the updated company data
    const updatedCompany = {
      companyName,
      companyEmail,
      companyPhone,
      companyFax,
      companyLogo,
      companyLocation,
      pricingStatus,
      budgetStatus,
      pricing,
      status,
    };
    // Find the company by ID and update its record
    const company = await Company.findByIdAndUpdate(id, updatedCompany, {
      new: true,
    });
    if (!company) {
      // If no company is found with the given ID, return an error response
      return res.status(404).send({
        message: 'Company not found!',
      });
    }
    if (company.budgetStatus === 1) {
      // Update the budgetStatus for all employees where budgetStatus is 0
      const updateResult = await Employee.updateMany({ budgetStatus: 0 }, { $set: { budgetStatus: 1 } });
      res.status(200).send({
        result: company,
        update: updateResult,
        message: 'Company record has been updated!',
      });
    } else {
      res.status(200).send({
        result: company,
        message: 'Company record has been updated!',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Something went wrong!',
      error,
    });
  }
};
const getAllCompanies = async (req, res) => {
  try {
    const company = await Company.find();
    res.status(200).send(company);
  } catch (error) {
    res.status(500).send('Something went wrong');
  }
};
const getCompanyDetails = async (req, res) => {
  const companyId = req.query.companyId;
  try {
    const getDetails = await Company.findOne({ _id: companyId });
    if (!getDetails) {
      return res.status(400).send({ message: 'Company not found' });
    } else {
      return res.send(getDetails);
    }
  } catch (error) {
    return res.send('Something went wrong').status(500);
  }
};

const deleteCompany = async (req, res) => {
  const companyId = req.params.id;
  try {
    await Company.findOneAndDelete({ _id: companyId });
    await Manager.deleteMany({ companyId });
    await Employee.deleteMany({ companyId });

    res.json({ message: 'Company and associated data deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete the company.' });
  }
};
module.exports = {
  addCompany,
  updateCompany,
  getCompanyDetails,
  getAllCompanies,
  deleteCompany,
};
