
var config = module.exports = {};
const dotenv = require('dotenv');
dotenv.config();
 
//mongo database
config.mongo = {};
config.mongo.uri = process.env.CONNECTION_STRING || 'localhost';
config.mongo.db = 'System-Order-Management';


//middlewares 
config.jwt = {};
config.jwt.isauthenticated = false

//mongo database
config.api = {};
config.api.closed_market_hour_start = 3
config.api.closed_market_hour_end = 12
config.api.interval = 300 //5 minutes
