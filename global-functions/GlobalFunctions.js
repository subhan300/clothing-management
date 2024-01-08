const nodemailer = require('nodemailer');
const fs = require('fs');
require('dotenv').config();

let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,

  auth: {
    user: 'sys.notification77@gmail.com',
    pass: process.env.EmailKey,
  },
  tls: {
    rejectUnauthorized: false,
  },
});


function sendEmail(mailOptions) {
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return error;
    } else {
      console.log('Email sent: ' + info.response);

      return true;
    }
  });
}

function writeFile(filePath, csvData) {
  fs.writeFile(filePath, csvData, (err) => {
    if (err) {
      console.error(err);
      return '404';
    } else {
      console.log('CSV data written to file');
      return 200;
    }
  });
}

const getCurrentDate = () => {
  const date = new Date();

  const options = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Europe/Berlin',
  };

  const formattedDate = date.toLocaleString('en-US', options);
  return formattedDate
  // return formattedDate;
};
function formatPrice(price) {
  return Number(price).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
}
module.exports = {
  sendEmail,
  writeFile,
  getCurrentDate,
  formatPrice,
};
