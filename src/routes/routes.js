const express = require("express");
const router = express.Router();
//admin
const user_admin_controller=require("../controller/admin/userController");

//client
const user_controller=require("../controller/client/usercontroller");
const otp_controller=require("../controller/client/otpcontroller");
const group_controller=require("../controller/client/groupController");

//client routes------------------------------------------->>>>>>>>>>>
router.post("/sendotp",otp_controller.sendotp);
router.post("/sendotpwhatsapp",otp_controller.sendotpwhatsapp);
router.post("/verifyotp",otp_controller.verifyotp);




router.post("/adduserInfo",user_controller.adduserInfo);
router.get("/sendInterestAndPreference",user_controller.sendInterestAndPreference);


//admin routes-------------------------------------------->>>>>>>>>>>>>>
router.post("/signup",user_admin_controller.signup);
router.post("/login",user_admin_controller.login);

router.post("/addGroup",group_controller.addGroup);
router.get("/getAllGroups",group_controller.getAllGroups);
router.post("/getGroupById/:groupId",group_controller.getGroupById);
router.put("/updateGroup/:id",group_controller.updateGroup);
router.delete("/deleteGroup",group_controller.deleteGroup);




module.exports = router;
