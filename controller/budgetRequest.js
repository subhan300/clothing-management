const { sendEmail } = require('../global-functions/GlobalFunctions');
const BudgetRequest = require('../models/budgetRequest');
const employee = require('../models/employee');
const i18next = require('i18next');
const managers = require('../models/manager');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const getBudgetRequest = async (req, res) => {
  try {
    const  companyId = req.params.id;
    const getBudgetRequest = await BudgetRequest.aggregate([
      {
        $lookup: {
          from: 'employees',
          localField: 'employeeId',
          foreignField: '_id',
          as: 'result',

        },
        
      },
      
      {
        $project: {
          'result.employeePassword': 0,
          'result.companyName': 0,
          'result.productsId': 0,
        },

      },
    ]);
   
    const tempCollection=[]
    for(let i=0;i<getBudgetRequest?.length;i++){
      if(getBudgetRequest[i].result[0].companyId.equals(companyId)){
      tempCollection.push(getBudgetRequest[i])
      }
    }
    res.status(200).json(tempCollection);
  } catch (error) {
    console.log("error",error)
    res.send('Something went wrong').status(500);
  }
};
const addRequest = async (req, res) => {
  console.log(req);
  // Access values in req.body
  const { employeeId, requestAmount, companyId,language } = req.body;
  // i18next.changeLanguage(language)
  try {
    BudgetRequest.find({
      employeeId: { $in: employeeId },
    }).then(async (existingEmployees) => {
      if (existingEmployees.length > 0) {
        return res.status(400).send({
          message: 'Sorry! You have already sent your budget request',
        });
      } else {
        const newRequest = new BudgetRequest({
          employeeId: new ObjectId(employeeId),
          requestAmount,
          approvedAmount: 0,
          status: 0,
        });
        const requestCreated = await newRequest.save();
        const getEmployee = await employee.findById(employeeId);

        const Managers = await managers.find({ companyId }).exec();
      
      const managerEmails= Managers.map(val=>val.managerEmail)
      
        let mailOptions = {
          from: 'sys.notification77@gmail.com',
          to:managerEmails??[""],
          subject:"Anfrage für Budgeterhöhung",
          text: `Mitarbeiter ${getEmployee?.employeeName} hat eine Budgeterhöhung von €${requestAmount} beantragt.`,

        };
        sendEmail(mailOptions);
        res.status(200).send({
          result: requestCreated,
          message: 'Request has been created successfully!',
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Something went wrong!',
      error,
    });
  }
};



const approvedRequest = async (req, res) => {
  // Access values in req.body
  const { employeeId, approvedAmount, status, requestId,language } = req.body;
  try {
    // i18next.changeLanguage(language)
    const employees = await employee.findById(employeeId).exec();
    if (status === "2") {
      const removedRequest = await BudgetRequest.findByIdAndRemove(requestId);

      return res.status(200).json({
        message: 'Your request has been rejected',
        removedRequest,
      });
    } else {
      // Update the approvedAmount and status values in request collection
      console.log('Update',employeeId)
      const updatedRequest = await BudgetRequest.findOneAndUpdate(
        { _id: requestId }, // Use _id as a condition to uniquely identify the request
        { $set: { approvedAmount, status } },
        { new: true },
      );
      // Update the budget value from employeeProducts collection
      let mailOptions = {
        from: 'sys.notification77@gmail.com',
        to: employees.employeeEmail,
        subject: `Budgetanfrage ${status == 2 ? 'abgelehnt' : 'genehmigt'} `,
        text: `Ihre Budgetanfrage wurde von Ihrem Manager ${status == 1 ? 'genehmigt' : 'abgelehnt'}`
      };
      sendEmail(mailOptions);
      const updatedBudget = await employee.findOneAndUpdate(
        { _id: employeeId }, // Use _id as a condition to uniquely identify the employee
        { $inc: { budget: approvedAmount } },
        { new: true },
      );
      const removedRequest = await BudgetRequest.findByIdAndRemove(requestId);
      const message = 'Your request has been accepted';
      return res.status(200).json({
        removedRequest,
        updatedRequest,
        updatedBudget,
        message,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error updating request' });
  }
};

const changeBudgetByManager = async (req, res) => {
  // Access values in req.body
  const { employeeId, changeBudgetAmount } = req.body;
  try {
    // Update the budget value from employeeProducts collection
    const updatedBudget = await employee.findOneAndUpdate(
      { _id: employeeId },
      { $set: { budget: changeBudgetAmount } },
      { new: true },
    );
    res.status(200).json({
      updatedBudget,
      message: 'Employee budget has been changed',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error updating request' });
  }
};
module.exports = {
  getBudgetRequest,
  addRequest,
  approvedRequest,
  changeBudgetByManager,
};
