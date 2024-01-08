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

// Import routes for authentication
const employeeLogin = require('./routes/auth');
const employeeSignUp = require('./routes/auth');
const managerLogin = require('./routes/auth');
const adminLogin = require('./routes/auth');

// Import routes for products
const addProduct = require('./routes/products');
const addCompanyProductById = require('./routes/products');
const updateProduct = require('./routes/products');
const deleteProduct = require('./routes/products');
const getProducts = require('./routes/products');
const getAllEmployeeProducts = require('./routes/products');
const deleteCompanyProduct = require('./routes/products');
const deleteEmployeeProduct = require('./routes/products');
const updateCompanyProduct = require('./routes/products');
const updateEmployeeProduct = require('./routes/products');
const getProductsByCompanyId = require('./routes/products');
const getEmployeeProductsByCompanyId = require('./routes/products');
const getProductsByEmployeeId = require('./routes/products');
const addEmployeeProductByCompanyId = require('./routes/products');

// Import routes for orders
const addOrder = require('./routes/order');
const getOrder = require('./routes/order');
const getTotalOrder = require('./routes/order');
const getOrderByEmployeeId = require('./routes/request');
const getOrderByCompanyId = require('./routes/request');

// Import routes for requests
const getRequest = require('./routes/request');
const addRequest = require('./routes/request');
const approvedRequest = require('./routes/request');
const changeBudgetByManager = require('./routes/request');

// Import routes for employees
const getEmployeeByCompanyId = require('./routes/employee');
const getTotalEmployee = require('./routes/employee');
const getEmployee = require('./routes/employee');
const addEmployees = require('./routes/employee');
const editEmployee = require('./routes/employee');
const deleteEmployee = require('./routes/employee');

// Import routes for company details
const addCompany = require('./routes/company');
const editCompany = require('./routes/company');
const getCompanyDetails = require('./routes/company');
const getAllCompanies = require('./routes/company');

// Import routes for managers
const addManagers = require('./routes/manager');
const editManager = require('./routes/manager');
const deleteManager = require('./routes/manager');
const getManagers = require('./routes/manager');
const getAllManagers = require('./routes/manager');
const getTotalManager = require('./routes/manager');
const getManagersByCompanyId = require('./routes/manager');

// Import dashboard route
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
app.use('/api/auth/', employeeLogin);
app.use('/api/auth/', employeeSignUp);
app.use('/api/auth/', managerLogin);
app.use('/api/auth/', adminLogin);

app.use('/api/product/', addProduct);
app.use('/api/product/', updateProduct);
app.use('/api/product/', deleteProduct);
app.use('/api/product/', getProducts);
app.use('/api/product/', getAllEmployeeProducts);
app.use('/api/product/', deleteCompanyProduct);
app.use('/api/product/', deleteEmployeeProduct);
app.use('/api/product/', updateCompanyProduct);
app.use('/api/product/', updateEmployeeProduct);
app.use('/api/product/', getProductsByCompanyId);
app.use('/api/product/', getEmployeeProductsByCompanyId);
app.use('/api/product/', getProductsByEmployeeId);
app.use('/api/product/', addCompanyProductById);
app.use('/api/product/', addEmployeeProductByCompanyId);

app.use('/api/order/', addOrder);
app.use('/api/order/', getOrder);
app.use('/api/order/', getTotalOrder);
app.use('/api/dashboard/', dashboarRoute);
app.use('/api/order/', getOrderByEmployeeId);
app.use('/api/order/', getOrderByCompanyId);

app.use('/api/request/', getRequest);
app.use('/api/request/', addRequest);
app.use('/api/request/', approvedRequest);
app.use('/api/request/', changeBudgetByManager);

app.use('/api/employee/', editEmployee);
app.use('/api/employee/', addEmployees);
app.use('/api/employee/', deleteEmployee);
app.use('/api/employee/', getEmployeeByCompanyId);
app.use('/api/employee/', getEmployee);
app.use('/api/employee/', getTotalEmployee);

app.use('/api/company/', addCompany);
app.use('/api/company/', editCompany);
app.use('/api/company/', getCompanyDetails);
app.use('/api/company/', getAllCompanies);

app.use('/api/manager/', addManagers);
app.use('/api/manager/', editManager);
app.use('/api/manager/', deleteManager);
app.use('/api/manager/', getManagers);
app.use('/api/manager/', getAllManagers);
app.use('/api/manager/', getTotalManager);
app.use('/api/manager/', getManagersByCompanyId);

module.exports = app;
