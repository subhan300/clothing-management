'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const { sendEmail } = require('./global-functions/GlobalFunctions');
const i18next = require('i18next');
const i18nextMiddleware = require('i18next-http-middleware');
const Backend = require('i18next-node-fs-backend');
const path = require('path');

const auth = require('./routes/auth');
const product = require('./routes/products');
const order = require('./routes/order');
const request = require('./routes/request');
const employee = require('./routes/employee');
const company = require('./routes/company');
const manager = require('./routes/manager');
const dashboarRoute = require('./routes/dashboard');

// Initialize i18next with the backend
function getLocalePath(lng, ns) {
  return path.join(__dirname, 'locales', lng, `${ns}.json`);
}

i18next
  .use(Backend)
  .init({
    lng: 'de', // Default language
    preload: ['en', 'de'], // Preload languages
    ns: ['translations'], // Namespace for your translation files
    fallbackLng: 'de', // Fallback language if the selected language is not available
    backend: {
      loadPath: (lng, ns) => getLocalePath(lng, ns),
    },
  });

const app = express();

// Middleware setup
app.use(i18nextMiddleware.handle(i18next));
app.use(cors({ origin: '*' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('tiny'));

// Custom middleware to set CORS headers
app.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Headers',
    'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method',
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

// Routes
app.use('/api/auth/', auth);
app.use('/api/product/', product);
app.use('/api/order/', order);
app.use('/api/request/', request);
app.use('/api/employee/', employee);
app.use('/api/company/', company);
app.use('/api/manager/', manager);


module.exports = app;
