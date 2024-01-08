const express = require('express');
const router = express.Router();
const manager = require('../controller/getManagerDetails');
router.post('/add-manager', manager.addManagers);
router.patch('/edit-manager/:id', manager.updateManager);
router.delete('/delete-manager/:id', manager.deleteManager);
router.get('/get-manager', manager.getManagers);
router.get('/get-allmanager', manager.getAllManagers);
router.get('/get-totalmanager', manager.totalManager);
router.get(
  '/get-allmanagerbycompanyId',
  manager.getManagersByCompanyId,
);
module.exports = router;
