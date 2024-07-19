const express = require("express");
const router = express.Router();
//admin
const user_admin_controller=require("../controller/admin/userController");
const venue_controller=require("../controller/admin/venueController");
const kitty_controller=require("../controller/admin/kittyController");
const interest_controller=require("../controller/admin/interestController");

//client
const user_controller=require("../controller/client/usercontroller");
const otp_controller=require("../controller/client/otpcontroller");
const group_controller=require("../controller/client/groupController");

//client routes------------------------------------------->>>>>>>>>>>
router.post("/sendotp",otp_controller.sendotp);
router.post("/sendotpwhatsapp",otp_controller.sendotpwhatsapp);
router.post("/verifyotp",otp_controller.verifyotp);


router.post("/adduserInfo",user_controller.adduserInfo);
router.post("/checkGender",user_controller.checkGender);
router.put("/updateUserInfo",user_controller.updateUserInfo);
router.get("/getUserDetailByMobileNumber/:phoneNumber",user_controller.getUserDetailByMobileNumber);
router.post("/sendaadharotp",user_controller.sendaadharotp);




//admin routes-------------------------------------------->>>>>>>>>>>>>>
router.post("/signup",user_admin_controller.signup);
router.post("/login",user_admin_controller.login);
router.get("/getAllUsersList",user_admin_controller.getAllUsersList);
router.get("/getUserKittyVenueGroupCount",user_admin_controller.getUserKittyVenueGroupCount);
router.get("/getuserById/:id",user_admin_controller.getuserById);
router.put("/updateUserInfo/:id",user_admin_controller.updateUserInfo);
router.delete("/deleteUserById/:id",user_admin_controller.deleteUserById);
router.patch("/updateStatus/:id",user_admin_controller.updateStatus);
router.put("/users/:id",user_admin_controller.updateUserImage)

//interest
router.get("/sendInterestAndPreference",interest_controller.sendInterestAndPreference);
router.post("/addInterest",interest_controller.addInterest);
router.get("/getInterestById/:id",interest_controller.getInterestById);
router.put("/updateInterest/:id",interest_controller.updateInterest);
router.delete("/deleteInterest/:id",interest_controller.deleteInterest);


//groups
router.post("/addGroup",group_controller.addGroup);
router.get("/getAllGroups",group_controller.getAllGroups);
router.get("/getGroupById/:id",group_controller.getGroupById);
router.put("/updateGroup/:id",group_controller.updateGroup);
router.delete("/deleteGroup/:id",group_controller.deleteGroup);
router.patch("/updateGroupStatus/:id",group_controller.updateStatus);

router.post("/addVenue",venue_controller.addVenue);
router.get("/getAllVenues",venue_controller.getAllVenues);
router.get("/getVenueById/:id",venue_controller.getVenueById);
router.put("/updateVenue/:id",venue_controller.updateVenue);
router.delete("/deleteVenue/:id",venue_controller.deleteVenue);
router.patch("/updateVenueStatus/:id",venue_controller.updateStatus);

//kitty
router.get("/getAllKittys",kitty_controller.getAllKittys);
router.post("/addKitty",kitty_controller.addKitty);
router.get("/getKittyById/:id",kitty_controller.getKittyById);
router.delete("/deleteKitty/:id",kitty_controller.deleteKittyById);
router.patch("/updateKittyStatus/:id",kitty_controller.updateKittyStatus);








module.exports = router;
