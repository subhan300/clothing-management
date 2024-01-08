const express = require('express');
const router = express.Router();
const request = require('../controller/budgetRequest');
var md_auth = require('../middleware/authenticated');
router.get('/get-request/:id', request.getBudgetRequest);
router.post('/add-request', request.addRequest);
router.put('/approved-request', request.approvedRequest);
router.put('/change-budget', request.changeBudgetByManager);
module.exports = router;
