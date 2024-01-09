const order = require('../models/order');
const Employee = require('../models/employee');
const employeeProducts = require('../models/employeeProducts');
const Company = require('../models/company');
const mongoose = require('mongoose');
const { sendEmail, getCurrentDate, formatPrice } = require('../global-functions/GlobalFunctions');
// const employee = require('../models/employee');
const Manager = require('../models/manager');
const orderCounter = require('../models/orderCounter');
const company = require('../models/company');



const ObjectId = mongoose.Types.ObjectId;
//Initialize the order number counter

// Function to generate the next invoice number
function generateInvoiceNumber(order) {
  order += 1;
  const invoiceNumber = `ODR-${order.toString().padStart(4, '0')}`;
  return invoiceNumber;
}


const adminMailOptionsF = (ordersArray, managerEmail, companyName, orderInfo, comment) => {
  let summaryTable = '';
  let totalBill = 0;

  // Loop through each order
  for (let order of ordersArray) {
    const { bill, employeeProducts } = order;
    totalBill += bill;
    let productsTable = '';

    // Loop through each product
    if (Array.isArray(employeeProducts)) {
      employeeProducts.forEach((product) => {
        const { productName, productSize, productImage, productPrice, productQuantity } = product;
        productsTable += `
              <div>
              <img src=${productImage} style="max-width: 100px; max-height: 100px;">
              <h3>Produktname: ${productName}</h3>
              <p>Größe: ${productSize}</p>
              <p>Preis: ${formatPrice(productPrice)}</p>
              <p>Menge: ${productQuantity}</p>
             
              </div>\n`;
      });

      productsTable += `<p>Gesamtpreis: ${formatPrice(bill)}</p>`
    }
    // Add the products table for this order to the summary
    summaryTable += `<h2>Bestellung für den Mitarbeiter ${order.employeeName} vom: ${order.name}-> " ${companyName} "</h2>` + productsTable;

  }
  summaryTable += `<h2>TOTAL-PREIS: ${formatPrice(totalBill)}</h2>`;
  summaryTable += `<h3>${comment}</h3>`
  return {
    from: 'subhan.akram1971@gmail.com',
    to: ['subhan.akram2400@gmail.com'],
    subject: 'Neue Bestellung erstellt..!!!',
    html: summaryTable,
  };
};
const managerMailOptionsF = (ordersArray, managerEmail, companyName, orderInfo, pricingStatus, comment) => {
  let summaryTable = '';
  let totalBill = 0;

  // Loop through each order
  for (let order of ordersArray) {
    const { bill, employeeProducts } = order;
    totalBill += bill;
    let productsTable = '';

    // Loop through each product
    if (Array.isArray(employeeProducts)) {
      employeeProducts.forEach((product) => {
        const { productName, productSize, productImage, productPrice, productQuantity } = product;
        productsTable += `
              <div>
              <img src=${productImage} style="max-width: 100px; max-height: 100px;">
              <h3>Produktname: ${productName}</h3>
              <p>Größe: ${productSize}</p>
              ${pricingStatus ? `<p>Preis: ${formatPrice(productPrice)}</p>` : " "}
              <p>Menge: ${productQuantity}</p>
             
              </div>\n`;
      });
    }
    pricingStatus ? productsTable += `<p>Gesamtpreis: ${formatPrice(bill)}</p>` : ""

    // Add the products table for this order to the summary
    summaryTable += `<h2>Bestellung für den Mitarbeiter ${order.employeeName} vom Unternehmen: ${companyName}</h2>` + productsTable;

  }
  summaryTable += `<h2>TOTAL-PREIS: ${formatPrice(totalBill)}</h2>`;
  summaryTable += `<h3>${comment}</h3>`
  return {
    from: 'subhan.akram1971@gmail.com',
    to: [managerEmail],
    subject: 'Neue Bestellung erstellt..!!!',
    html: summaryTable,
  };
};
const EmployeeMailOptionsF = (employeeEmail, managerEmail, companyName, orderInfo, pricingStatus, comment) => {
  const { bill, employeeProducts } = orderInfo;
  let productsTable = '';
  if (Array.isArray(JSON.parse(employeeProducts))) {
    JSON.parse(employeeProducts).forEach((product) => {
      const { productName, productSize, productImage, productPrice, productQuantity } = product;
      productsTable += `
        <div>
         <img src=${productImage} style="max-width: 100px; max-height: 100px;">
        <h3>Produktname: ${productName}</h3>
          <p>Größe : ${productSize}</p>
         ${pricingStatus ? `<p>Preis: ${formatPrice(productPrice)}</p>` : ''} 
          <p>Menge: ${productQuantity}</p>
        </div>\n`;
    });
  }

  const htmlContent = `
  <p>Bestellung wurde erstellt für den Mitarbeiter mit der E-Mail: ${employeeEmail} vom Unternehmen: ${companyName} <p>
  <h2>// Bestellinformationen: </h2>
      ${productsTable}
     ${pricingStatus ? `<h3>Gesamtpreis: ${formatPrice(bill)}</h3>` : ''}
`;

  return {
    from: 'subhan.akram1971@gmail.com',
    to: [employeeEmail],
    subject: "Neue Bestellung erstellt..!!!",
    html: htmlContent,
  };
};
const adminManagerEmployeeMailOptionsF = (employeeEmail, managerEmail, companyName, orderInfo, pricingStatus,comment) => {
  const { bill, employeeProducts } = orderInfo;
  let productsTable = '';
  if (Array.isArray(JSON.parse(employeeProducts))) {
    JSON.parse(employeeProducts).forEach((product) => {
      const { productName, productSize, productImage, productPrice, productQuantity } = product;
      productsTable += `
        <div>
         <img src=${productImage} style="max-width: 100px; max-height: 100px;">
        <h3>Produktname: ${productName}</h3>
          <p>Größe: ${productSize}</p>
         <p>Preis: ${formatPrice(productPrice)}</p>
          <p>Menge: ${productQuantity}</p>
        </div>\n`;
    });
  }

  const htmlContent = `
  <p>Bestellung wurde erstellt für den Mitarbeiter: ${order.employeeName} mit der E-Mail: ${employeeEmail} vom Unternehmen: ${companyName} <p>
  <h2> // Bestellinformationen: </h2>
      ${productsTable}
     <h3>Gesamtpreis: ${formatPrice(bill)}</h3>
     <h3>${comment}</h3>
`;
  return {
    from: 'subhan.akram1971@gmail.com',
    to: [managerEmail],
    subject: `Neue Bestellung erstellt..!!!`,
    html: htmlContent,
  };
};

const validation = (CompanyId, companyIdAsObjectId, res) => {

  if (CompanyId.equals(companyIdAsObjectId)) {

    return true;
  } else {

    return false;
  }
};

const addOrders = async (req, res) => {
  try {
    const ordersArray = req.body;
    console.log("lan", ordersArray[0]?.language)
    // i18next.changeLanguage(ordersArray[0].language);
    const orders = [];
    let isValidOrder = true;
    let newOrders;
    const getFromOrderCollection = await order.find({});

    const Company = await company.findById({
      _id: ordersArray[0].companyId,
    });

    if (!Company) {
      return res.status(400).send({ message: 'Company not found' });
    }

    const getEmployee = await Employee.findById(ordersArray[0].employeeId);

    if (!validation(Company._id, getEmployee.companyId, res)) {
      return res.status(400).json({ message: 'You Dont Belong To This Company' });
    }

    const invoice = generateInvoiceNumber(getFromOrderCollection.length);

    if (ordersArray[0].role === 'manager') {
      const orderObj = new order({
        employeeId: ordersArray[0].employeeId,
        companyId: ordersArray[0].companyId,
        products: [],
        companyName: ordersArray[0].companyName,
        bill: ordersArray[0].bill,
        quantity: ordersArray[0].quantity,
        comment: ordersArray[0].comment,
        invoice: invoice,
        role: ordersArray[0].role,
        managerOrder: ordersArray,
        createdAt: getCurrentDate(),
      });

      newOrders = await order.insertMany(orderObj);

      if (Company.budgetStatus) {

        for (const orders of newOrders[0].managerOrder) {
          const { employeeId, bill } = orders;

          await Employee.findOneAndUpdate({ _id: employeeId }, { $inc: { budget: -bill } });
        }
      }

      for (let i = 0; i < ordersArray.length; i++) {
        let orderInfo = {
          bill: ordersArray[i].bill,
          employeeProducts: JSON.stringify(ordersArray[i].employeeProducts),
        };
        let mailOptions = EmployeeMailOptionsF(
          ordersArray[i].employeeEmail,
          ordersArray[i].managerEmail,
          ordersArray[i].companyName,
          orderInfo,
          ordersArray[0].pricingStatus,
          ordersArray[0]?.comment
        );

        sendEmail(mailOptions);

      }

      let mailOptions = managerMailOptionsF(
        ordersArray,
        ordersArray[0].managerEmail,
        ordersArray[0].companyName,
        ordersArray,
        ordersArray[0].pricingStatus,
        ordersArray[0].comment
      );

      let adminMailOptions = adminMailOptionsF(
        ordersArray,
        ordersArray[0].managerEmail,
        ordersArray[0].companyName,
        ordersArray,
        ordersArray[0].comment

      );
      sendEmail(mailOptions);

      sendEmail(adminMailOptions);
    } else {

      let orderData = ordersArray[0];
      const { employeeId, bill } = orderData;


      const manager = await Manager.find({ companyId: orderData.companyId });


      const orderObj = new order({
        employeeId,
        companyId: orderData.companyId,
        products: orderData.employeeProducts,
        companyName: orderData.companyName,
        bill: orderData.bill,
        quantity: orderData.quantity,
        comment: orderData?.comment,
        invoice: invoice,
        createdAt: getCurrentDate(),
        employeeName: orderData.employeeName,

      });
      orders.push(orderObj);

      if (!isValidOrder) {
        return res.status(400).send({
          message: 'Invalid order - employee budget is insufficient',
        });
      }

      newOrders = await order.insertMany(orderObj);

      if (Company.budgetStatus) {

        await Employee.findOneAndUpdate({ _id: employeeId }, { $inc: { budget: -bill } });
      }

      let orderInfo = {
        bill: ordersArray[0].bill,
        employeeProducts: JSON.stringify(ordersArray[0].employeeProducts),
      };

      let mailOptions = EmployeeMailOptionsF(
        orderData.employeeEmail,
        manager[0].managerEmail,
        orderData.companyName,
        orderInfo,
        ordersArray[0].pricingStatus,
        ordersArray[0].comment
      );
      let adminMailOptions = adminManagerEmployeeMailOptionsF(orderData.employeeEmail,
        manager[0].managerEmail,
        orderData.companyName,
        orderInfo, ordersArray[0].comment)

      sendEmail(mailOptions);
      sendEmail(adminMailOptions);

    }

    res.status(200).send({
      result: newOrders,
      message: 'Orders have been created successfully!',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Something went wrong!',
      error,
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const getOrders = await order.aggregate([
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
    res.status(200).send(getOrders);
  } catch (error) {
    console.log(error);
    res.send('Something went wrong').status(500);
  }
};
const totalOrder = async (req, res) => {
  try {
    const { companyId } = req.query;

    let pipeline = [
      {
        $lookup: {
          from: 'employees',
          localField: 'employeeId',
          foreignField: '_id',
          as: 'result',
        },
      },
      {
        $count: 'totalOrder',
      },
    ];

    if (companyId) {
      pipeline = [
        {
          $match: {
            companyId: new ObjectId(companyId),
          },
        },
        ...pipeline,
      ];
    }

    const getTotalOrders = await order.aggregate(pipeline);
    res.status(200).send(getTotalOrders);
  } catch (error) {
    console.log(error);
    res.send('Something went wrong').status(500);
  }
};

const getOrderByEmployeeId = async (req, res) => {
  const employeeId = req.query.employeeId;
  try {
    const getOrderByEmployeeId = await order.find({ employeeId });
    if (!getOrderByEmployeeId) {
      res.status(400).send({ message: 'ID not found' });
    } else {
      res.send(getOrderByEmployeeId);
    }
  } catch (error) {
    console.log(error);
    res.send('Something went wrong').status(500);
  }
};

const getOrderByCompanyId = async (req, res) => {
  const companyId = req.query.companyId;
  try {
    const getEmployeeByCompanyId = await Company.aggregate([
      {
        $match: {
          _id: new ObjectId(companyId),
        },
      },
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'companyId',
          as: 'orders',
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
          'employees.companyName': 0,
          'employees.productsId': 0,
          'employees.companyId': 0,
        },
      },
    ]);
    res.status(200).send(getEmployeeByCompanyId);
  } catch (error) {
    console.log(error);
    res.send('Something went wrong').status(500);
  }
};
module.exports = {
  getOrderByCompanyId,
  getOrders,
  totalOrder,
  addOrders,
  getOrderByEmployeeId,
};
