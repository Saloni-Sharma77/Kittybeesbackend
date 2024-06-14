const express = require("express");
const router = express.Router();
//admin
const user_admin_controller=require("../controller/admin/userController");

//client
const user_controller=require("../controller/client/usercontroller");
const otp_controller=require("../controller/client/otpcontroller");

//client routes
router.post("/adduserInfo",user_controller.adduserInfo);
router.post("/sendotp",otp_controller.sendotp);
router.post("/sendotpwhatsapp",otp_controller.sendotpwhatsapp);
router.post("/verifyotp",otp_controller.verifyotp);
router.get("/sendInterestAndPreference",user_controller.sendInterestAndPreference);


//admin routes
router.post("/signup",user_admin_controller.signup);
router.post("/login",user_admin_controller.login);



module.exports = router;
