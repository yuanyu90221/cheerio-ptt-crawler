const mongoose = require('mongoose');

const {isRunOnDocker, dbName, dbDomain, port} = require('../config/mongodb.json'); 

const user = process.env.MONGODB_USER || 'yuanyu';
const passwd = process.env.MONGODB_PASSWD || 'dob770407';

let DBManager = {
  getConnection: ()=>{
    console.log(`MONGODB_USER: ${user}, MONGODB_PASSWD: ${passwd}, port: ${port}, dbDomain: ${dbDomain}, dbName: ${dbName},`);
    return mongoose.createConnection(`mongodb://${user}:${passwd}@${dbDomain}:${port}/${dbName}`, {useNewUrlParser: true});
  }
};

module.exports = DBManager;