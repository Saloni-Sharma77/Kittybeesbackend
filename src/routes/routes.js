const express = require("express");
const router = express.Router();
const user_controller=require("../controller/usercontroller");

router.post('/loginWithPhoneOtp', user_controller.loginWithPhoneOtp);
router.post('/verifyPhoneOtp', user_controller.verifyPhoneOtp);
router.post("/adduserInfo",user_controller.adduserInfo);


module.exports = router;
