const express = require('express');
const router = express.Router();
const order = require('../controller/order');
const i18next = require('i18next');
var md_auth = require('../middleware/authenticated');
const { sendEmail } = require('../global-functions/GlobalFunctions');
router.post('/add-order', order.addOrders);
router.get('/get-order', order.getOrders);
router.get('/get-TotalOrder:companyId?', order.totalOrder);

router.post("/sendEmail",async(req,res)=>{
  try{
    const {language}=req.body;
    console.log("language==",language)
    i18next.changeLanguage(language);
   let mailOptions = {
     from: 'sys.notification77@gmail.com',
     to: "subhan.akram2400@gmail.com", 
     subject: `Demo Testing for translation`,
     text: `${i18next.t('send')}`,
   };
  await sendEmail(mailOptions);
   res.status(200).json({message:"done !"})
  }catch(err){
   res.status(400).json({message:`error ${err.message}`})
  }
  
 })
router.get(
  '/get-orderbyemployeeId',
  order.getOrderByEmployeeId,
);
router.get(
  '/get-orderbycompanyId',
  order.getOrderByCompanyId,
);
router.post('/add-order', order.addOrders);
router.get('/get-order', order.getOrders);
router.get('/get-TotalOrder:companyId?', order.totalOrder);
router.get(
  '/get-orderbyemployeeId',
  order.getOrderByEmployeeId,
);
router.get(
  '/get-orderbycompanyId',
  order.getOrderByCompanyId,
);
// md_auth.ensureManagerAuth
module.exports = router;
