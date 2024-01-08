'use strict';
const mongoose = require('mongoose');
const app = require('./app');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const dotenv = require('dotenv');
dotenv.config();
const Config = require('./configuration/config');
const orderCounter = require('./models/orderCounter');
const port = 3977;
// mongodb://0.0.0.0:27017/clothingcompany
// useNewUrlParser: true, useUnifiedTopology: true
// console.log("process",process.env.LOCAL)
const DB = process.env.CONNECTION_STRING;
// process.env.CONNECTION_STRING

mongoose
  .connect(DB)
  .then(() => {
    try {
      console.log('connection successfully !');
      app.use(bodyParser.json());
      // Enable CORS policy
      app.use(cors());
      app.options('*', cors());
      app.use(cors());
      app.use(bodyParser.urlencoded({ extended: false }));
      app.use(bodyParser.json());
      http.createServer(app).listen(process.env.PORT || { port }, console.log(`Server is running on the port no: ${port} `));
    } catch (err) {
      console.log('err', err);
    }
  })
  .catch((err) => {
    console.log('err', err);
  });
