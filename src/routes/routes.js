const express = require("express");
const router = express.Router();
const user_controller=require("../controller/usercontroller");

// router.post("/addNewUser",user_controller.addNewUser);
router.post("/loginWithPhoneOtp",user_controller.loginWithPhoneOtp);
router.post("/adduserInfo",user_controller.adduserInfo);
// router.post("/addContactInformation",user_controller.addContactInformation);
// router.post("/addInterestsandPreferences",user_controller.addInterestsandPreferences);

// router.post("/addSocialProfileSetup",user_controller.addSocialProfileSetup);




module.exports = router;
