
const UsersModel=require("../../schema/userSchema");



exports.generateOtp = function(length = 6) {
  return Math.floor(100000 + Math.random() * 900000).toString().substring(0, length);
};


  