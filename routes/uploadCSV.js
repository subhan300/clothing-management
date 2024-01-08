const express = require("express");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const uploadcsv = require('../controller/uploadCSV');
const router = express.Router();

router.post('/upload-file', upload.single('file'), uploadcsv.uploadCSV);
module.exports = router