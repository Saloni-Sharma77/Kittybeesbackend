// routes/index.js or your specific routes file
const express = require("express");
const router = express.Router();

// Admin controllers
const user_admin_controller = require("../controller/admin/userController");
const venue_controller = require("../controller/admin/venueController");
const kitty_controller = require("../controller/admin/kittyController");
const interest_controller = require("../controller/admin/interestController");
const banner_controller = require("../controller/admin/bannerController");
const roles_controller = require("../controller/admin/roleController");
const activity_controller = require("../controller/admin/activityController");
const themes_controller = require("../controller/admin/themesController");
const venueCategory_controller = require("../controller/admin/venueCategoryController"); // Import the controller for venueCategory

// Client controllers
const user_controller = require("../controller/client/usercontroller");
const otp_controller = require("../controller/client/otpcontroller");
const group_controller = require("../controller/client/groupController");
const chat_controller = require("../controller/client/chatController");
const message_controller = require("../controller/client/messageController");

// Client routes
router.post("/sendotp", otp_controller.sendotp);
router.post("/sendotpwhatsapp", otp_controller.sendotpwhatsapp);
router.post("/verifyotp", otp_controller.verifyotp);
router.post("/isUserLoggedIn", otp_controller.isUserLoggedIn);

router.post("/adduserInfo", user_controller.adduserInfo);
router.post("/checkGender", user_controller.checkGender);
router.put("/updateUserInfo", user_controller.updateUserInfo);
router.get("/getUserDetailByMobileNumber/:phoneNumber", user_controller.getUserDetailByMobileNumber);

// Chat routes
router.post("/createChat", chat_controller.createChat);
router.get("/getChats", chat_controller.getChats);

// Message routes
router.post("/createMessage", message_controller.createMessage);
router.get("/getMessages/:chatId", message_controller.getMessages);

// Admin routes
router.post("/signup", user_admin_controller.signup);
router.post("/login", user_admin_controller.login);
router.get("/getAllUsersList", user_admin_controller.getAllUsersList);
router.get("/getUserKittyVenueGroupCount", user_admin_controller.getUserKittyVenueGroupCount);
router.get("/getuserById/:id", user_admin_controller.getuserById);
router.put("/updateUserInfo/:id", user_admin_controller.updateUserInfo);
router.delete("/deleteUserById/:id", user_admin_controller.deleteUserById);
router.patch("/updateStatus/:id", user_admin_controller.updateStatus);
router.put("/users/:id", user_admin_controller.updateUserImage);

// Interest routes
router.get("/sendInterestAndPreference", interest_controller.sendInterestAndPreference);
router.post("/addInterest", interest_controller.addInterest);
router.get("/getInterestById/:id", interest_controller.getInterestById);
router.put("/updateInterest/:id", interest_controller.updateInterest);
router.delete("/deleteInterest/:id", interest_controller.deleteInterest);
router.patch("/updateInterestStatus/:id", interest_controller.updateInterestStatus);

// Banner routes
router.get("/getAllBanner", banner_controller.getAllBanner);
router.post("/addBanner", banner_controller.addBanner);
router.get("/getBannerById/:id", banner_controller.getBannerById);
router.put("/updateBanner/:id", banner_controller.updateBanner);
router.delete("/deleteBanner/:id", banner_controller.deleteBanner);
router.patch("/updateBannerStatus/:id", banner_controller.updateBannerStatus);

// Activity routes
router.get("/getAllActivity", activity_controller.getAllActivity);
router.post("/addActivity", activity_controller.addActivity);
router.get("/getActivityById/:id", activity_controller.getActivityById);
router.put("/updateActivity/:id", activity_controller.updateActivity);
router.delete("/deleteActivity/:id", activity_controller.deleteActivity);
router.patch("/updateActivityStatus/:id", activity_controller.updateActivityStatus);

// Roles routes
router.get("/getAllRoles", roles_controller.getAllRoles);
router.post("/addRoles", roles_controller.addRoles);
router.get("/getRolesById/:id", roles_controller.getRolesById);
router.put("/updateRoles/:id", roles_controller.updateRoles);
router.delete("/deleteRoles/:id", roles_controller.deleteRoles);

// Themes routes
router.get("/getAllThemes", themes_controller.getAllThemes);
router.post("/addThemes", themes_controller.addThemes);
router.get("/getThemesById/:id", themes_controller.getThemesById);
router.put("/updateThemes/:id", themes_controller.updateThemes);
router.delete("/deleteThemes/:id", themes_controller.deleteThemes);
router.patch("/updateThemesStatus/:id", themes_controller.updateThemesStatus);

// Group routes
router.post("/addGroup", group_controller.addGroup);
router.get("/getAllGroups", group_controller.getAllGroups);
router.get("/getGroupById/:id", group_controller.getGroupById);
router.get("/getGroupHostedByMe/:id", group_controller.getGroupHostedByMe);
router.put("/updateGroup/:id", group_controller.updateGroup);
router.delete("/deleteGroup/:id", group_controller.deleteGroup);
router.patch("/updateGroupStatus/:id", group_controller.updateStatus);

router.post("/addGroupCategory", group_controller.addGroupCategory);
router.get("/getAllGroupsCategory", group_controller.getAllGroupsCategory);
router.get("/getGroupCategoryById/:id", group_controller.getGroupCategoryById);
router.put("/updateCategoryGroup/:id", group_controller.updateCategoryGroup);
router.delete("/deleteCategoryGroup/:id", group_controller.deleteCategoryGroup);


// Venue routes
router.post("/addVenue", venue_controller.addVenue);
router.get("/getAllVenues", venue_controller.getAllVenues);
router.get("/getVenueById/:id", venue_controller.getVenueById);
router.put("/updateVenue/:id", venue_controller.updateVenue);
router.delete("/deleteVenue/:id", venue_controller.deleteVenue);
router.patch("/updateVenueStatus/:id", venue_controller.updateStatus);

// VenueCategory routes
router.post("/addVenueCategory", venueCategory_controller.createVenueCategory);
router.get("/getAllVenueCategories", venueCategory_controller.getAllVenueCategories);
router.get("/getVenueCategoryById/:id", venueCategory_controller.getVenueCategoryById);
router.put("/updateVenueCategory/:id", venueCategory_controller.updateVenueCategory);
router.delete("/deleteVenueCategory/:id", venueCategory_controller.deleteVenueCategory);

router.get("/getAllKittys", kitty_controller.getAllKittys);
router.post("/addKitty", kitty_controller.addKitty);
router.get("/getKittyById/:id", kitty_controller.getKittyById);
router.delete("/deleteKitty/:id", kitty_controller.deleteKittyById);
router.patch("/updateKittyStatus/:id", kitty_controller.updateKittyStatus);

module.exports = router;
