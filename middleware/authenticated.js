'use strict';
const jwt = require('jsonwebtoken');
const Employee = require('../models/employee');
const Manager = require('../models/manager');

const ensureEmployeeAuth = async function (req, res, next) {
  if (!req.headers.authorization) {
    return res
      .status(403)
      .send({ message: 'The request does not have the authentication header' });
  }

  const token = req.headers.authorization.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, 'ClothingCompany');
    const { _id } = decodedToken.result;
    console.log(_id);
    await Employee.findById(_id)
      .exec()
      .then((user) => {
        if (!user) {
          return res.status(403).send({ message: 'Unauthorized request' });
        } else {
          req.user = user;
          next();
        }
      })
      .catch((error) => {
        console.error(error);
        return res.status(401).send({ message: 'user not authorized' });
      });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'invalid token' });
  }
};
const ensureManagerAuth = async function (req, res, next) {
  if (!req.headers.authorization) {
    return res.status(403).send({ message: 'Unauthorized request' });
  }
  const token = req.headers.authorization.split(' ')[1];
  try {
    const decodedToken = jwt.verify(token, 'ClothingCompany');
    const { _id } = decodedToken.result;
    console.log(_id);
    await Manager.findById(_id)
      .exec()
      .then((user) => {
        if (!user) {
          return res.status(403).send({ message: 'The user does not exist' });
        } else {
          req.user = user;
          next();
        }
      })
      .catch((error) => {
        console.error(error);
        return res.status(401).send({ message: 'user not authorized' });
      });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Invalid token' });
  }
};

module.exports = { ensureEmployeeAuth, ensureManagerAuth };
