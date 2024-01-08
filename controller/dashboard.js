const allProducts = require("../models/allProducts");
const company = require("../models/company");
const employee = require("../models/employee");
const manager = require("../models/manager");
const order = require("../models/order");



const totalDataCount=async(req,res)=>{
  try{
    const totalManagers=await manager.count();
    const totalCompanies=await company.count();
    const totalOrders=await order.count();
    const totalAllProducts=await allProducts.count();
    const totalEmployees=await employee.count()   
  
    const  totalData={
        totalCompanies,
        totalOrders,
        totalAllProducts,
        totalEmployees,
        totalManagers
    }
    res.status(200).json({totalData});
  }catch(e){
    return res.status(500).json({message:e.message})
  }
}


module.exports = {
    totalDataCount
}