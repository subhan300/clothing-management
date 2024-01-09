const Employee = require('../models/employee');
const Manager = require('../models/manager');
const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../global-functions/GlobalFunctions');
const employeeLogin = async (req, res) => {
  try {
    const { employeeEmail, employeePassword } = req.body;
    console.log(req.body);
    if (!employeeEmail || !employeePassword) {
      return res.status(422).send({ error: 'You must provide email and password.' });
    }
    const result = await Employee.findOne({ employeeEmail });
    if (!result) {
      return res.status(401).send({
        message: 'Invalid email or password',
      });
    }
    if (result) {
      const password = await Employee.findOne({ employeePassword });
      if (password) {
        const token = jwt.sign({ result }, 'ClothingCompany', {
          expiresIn: '30d',
        });
        const resultRes = {
          message: 'Login Successful',
          token,
          result: result,
          name: result.employeeName,
        };
        res.status(200).send(resultRes);
      } else {
        res.status(401).send({
          message: 'Invalid email or password',
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong');
  }
};
const employeeSignUp = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(422).send({ error: 'You must provide email and password.' });
    } else {
      const result = new Employee({
        employeeEmail: email,
        employeePassword: password,
      });
      const data = await result.save();
      res.status(200).send(data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Something went wrong');
  }
};
const sendGernalEmail=async(req,res)=>{
  try{
      const {email,password}=req.body;
      let mailOptions = {
        from: 'subhan.akram1971@gmail.com',
        to: email,
        subject: `Budget Increase Request`,
        text: `Your Password ${password}  Link : https://clothing-management-frontend.vercel.app/`,

      };
      sendEmail(mailOptions);
  }catch(err){
    res.status(500).send('Something went wrong');
  }
}
const managerLogin = async (req, res) => {
  try {
    const { managerEmail, managerPassword } = req.body;
    if (!managerEmail || !managerPassword) {
      return res.status(422).send({ error: 'You must provide email and password.' });
    }
    const result = await Manager.findOne({ managerEmail });
    if (!result) {
      return res.status(401).send({
        message: 'Invalid email or password',
      });
    }
    if (result) {
      const password = await Manager.findOne({ managerPassword });
      if (password) {
        const token = jwt.sign({ result }, 'ClothingCompany', {
          expiresIn: '30d',
        });
        const resultRes = {
          message: 'Login Successful',
          token,
          result,
          name: result.name,
        };
        res.status(200).send(resultRes);
      } else {
        res.status(401).send({
          message: 'Invalid email or password',
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong');
  }
};
const adminLogin = async (req, res) => {
  console.log(req.body);
  try {
    const { adminEmail, adminPassword } = req.body;
    if (!adminEmail || !adminPassword) {
      return res.status(422).send({ error: 'You must provide email and password.' });
    }
    const result = await Admin.findOne({ adminEmail });
    console.log("result",result)
    if (!result) {
      return res.status(401).send({
        message: 'Invalid email or password',
      });
    }
    if (result) {
      const password = await Admin.findOne({ adminPassword });
      if (password) {
        const token = jwt.sign({ result }, 'ClothingCompany', {
          expiresIn: '30d',
        });
        const resultRes = {
          message: 'Login Successful',
          token,
          result,
          name: result.name,
        };
        res.status(200).send(resultRes);
      } else {
        res.status(401).send({
          message: 'Invalid email or password',
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong');
  }
};
module.exports = {
  employeeLogin,
  employeeSignUp,
  managerLogin,
  adminLogin,
  sendGernalEmail
};
