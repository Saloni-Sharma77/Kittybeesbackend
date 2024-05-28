
const UsersModel=require("../schema/userSchema");

exports.generateOTP = function() {
    return Math.floor(100000 + Math.random() * 900000).toString(); 
  };
  