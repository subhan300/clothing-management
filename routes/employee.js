const express = require('express');
const router = express.Router();
const employee = require('../controller/employee');
var md_auth = require('../middleware/authenticated');
router.post('/add-employee', employee.addEmployees);
// md_auth.ensureManagerAuth,

router.patch('/edit-employee/:id', employee.updateEmployee);
router.delete(
  '/delete-employee/:id',
  employee.deleteEmployee,
);
// md_auth.ensureManagerAuth,
router.get(
  '/get-employeebycompanyId',
  employee.getEmployeeByCompany,
);
router.get(
  '/get-totalemployee:companyId?',
  employee.totalEmployee,
);
router.get('/get-employee', employee.getEmployee);
module.exports = router;
