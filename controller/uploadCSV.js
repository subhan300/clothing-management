const csv = require('csvtojson');
const csvFilePath = `${__dirname}/../uploads/usernamefile.csv`;
const employeeProducts = require('../models/employeeProducts');
const CompanyProductsCollection = require('../models/companyProducts');
const Employee = require('../models/employee');
const Company = require('../models/company');
const Manager = require('../models/manager');
const { sendEmail } = require('../global-functions/GlobalFunctions');

// for Auto-generated password
function generatePassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = Math.floor(Math.random() * 5) + 8; // Random length between 8 and 12
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars.charAt(randomIndex);
  }
  return password;
}
const productFormatConvertor = (jsonObj) => {
  // console.log("sss", jsonObj[0].companyProducts)
  const productsArray = jsonObj[0].companyProducts.split(',').map((productString) => {
    const [productName, productSize, productImage, Price] = productString.trim().split(' ');
    const productPrice = parseInt(Price);
    const productQuantity = 1;
    return {
      productName,
      productSize,
      productImage,
      productPrice,
      productQuantity,
    };
  });
  return productsArray;
};

const uploadCSV = (req, res) => {
  csv()
    .fromFile(req?.file?.path)
    .then(async (jsonObj) => {
      // Create an array to hold products data
      // console.log("json",jsonObj)
      const products = [];
      // Create an array to hold employee data
      const emp = [];
      //  subhan-akram , company create here
      const saveCompanyF = async () => {
        const newCompany = new Company({
          companyName: jsonObj[0].companyName,
          companyEmail: jsonObj[0].companyEmail,
          companyPhone: jsonObj[0].companyPhone,
          companyFax: jsonObj[0].companyFax,
          companyLogo: jsonObj[0].companyLogo,
        });

        const savedCompany = await newCompany.save();
        return savedCompany;
      };
      const savedCompany = await saveCompanyF();

      // for create a collection of company products
      const companyProducts = async (jsonObj) => {
        const productsArray = await productFormatConvertor(jsonObj);
        const companyProductsCollectionArray = new CompanyProductsCollection({
          companyId: savedCompany._id,
          products: productsArray,
        });
        await companyProductsCollectionArray.save();
      };
      companyProducts(jsonObj);
      const companyManager = async (i) => {
        if (jsonObj[i].managerName !== undefined && jsonObj[i].managerEmail !== undefined) {
          const newManager = new Manager({
            name: jsonObj[i]?.managerName,
            managerEmail: jsonObj[i]?.managerEmail,
            managerPassword: jsonObj[i]?.managerName + '123',
            companyId: savedCompany._id,
            companyName: savedCompany.companyName,
          });

          const savedManager = await newManager.save();
          let mailOptions = {
            from: 'sys.notification77@gmail.com',
            to: jsonObj[i].managerEmail,
            subject: `Hello ${jsonObj[i]?.managerName} ,Your Credentials`,
            text: `Email : ${jsonObj[i]?.managerEmail} , Password : ${jsonObj[i]?.managerName + '123'} }`,
          };
          sendEmail(mailOptions);
          return savedManager;
        }
      };
      for (let i = 0; i < 1; i++) {
        companyManager(i);
      }
      for (let i = 0; i < jsonObj.length; i++) {
        const productsArray = jsonObj[i].products.split(',').map((productString, ind) => {
          // console.log("i",i,"product : ",productString.trim().split(" "),"product >",productString)
          const [productName, productSize, productImage, Price, Quantity] = productString.trim().split(' ');
          const productPrice = Number(Price);
          const productQuantity = Quantity == undefined ? 1 : Quantity;
          console.log('i', i, 'price : ', productPrice, 'qty : ', productQuantity);
          return {
            productName,
            productSize,
            productImage,
            productPrice,
            productQuantity,
          };
        });
        products.push({
          products: productsArray,
          companyId: savedCompany._id,
        });
      }
      // Insert data into employeeProducts collection
      employeeProducts
        .insertMany(products)
        .then(function (insertedProducts) {
          insertedProducts.forEach(function (product, i) {
            const empForProduct = [];
            const obj = {};
            obj.employeeName = jsonObj[i].employeeName;
            obj.employeeEmail = jsonObj[i].employeeEmail;
            obj.gender = jsonObj[i].gender;
            obj.budget = jsonObj[i].budget;
            obj.companyName = savedCompany.companyName;
            obj.companyId = savedCompany.id;

            const generatedPassword = generatePassword();
            empForProduct.push({
              productsId: product._id,
              employeeName: obj.employeeName,
              employeePassword: generatedPassword,
              employeeEmail: obj.employeeEmail,
              gender: obj.gender,
              companyName: obj.companyName,
              companyId: obj.companyId,
              budget: parseInt(obj.budget),
            });
            emp.push(...empForProduct);
            // console.log("emp>>", emp);
          });
          // get employe email to find already existed users

          const employeeEmails = emp.map((emp) => emp.employeeEmail);
          // to find email of users
          Employee.find({ employeeEmail: { $in: employeeEmails } })
            .then(function (existingEmployees) {
              const existingEmails = existingEmployees.map((emp) => emp.employeeEmail);
              const newEmployees = emp.filter((emp) => !existingEmails.includes(emp.employeeEmail));
              let mailOptions;
              Employee.insertMany(newEmployees)
                .then(function (emp) {
                  console.log('emp', emp);
                  for (let i = 0; i < emp.length; i++) {
                    mailOptions = {
                      from: 'sys.notification77@gmail.com',
                      to: emp[i].employeeEmail,
                      subject: `Hello ${emp[i]?.employeeName} ,Your Credentials`,
                      text: `Email : ${emp[i]?.employeeEmail} , Password : ${emp[i].employeePassword}`,
                    };
                    sendEmail(mailOptions);
                  }
                  res.status(200).send({
                    message: 'Successfully Uploaded!',
                  });
                })
                .catch(function (error) {
                  res.status(500).send({
                    message: 'Error uploading user data to employee collection:',
                    error,
                  });
                });
            })
            .catch(function (error) {
              res.status(500).send({
                message: 'Error checking existing employees in employee collection:',
                error,
              });
            });
        })
        .catch(function (error) {
          res.status(500).send({
            message: 'Error uploading product data to employeeProducts collection:',
            error,
          });
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(401).send({
        message: 'failure',
        error,
      });
    });
};

module.exports = {
  uploadCSV,
};
