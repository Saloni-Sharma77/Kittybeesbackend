// routes/index.js or your specific routes file
const express = require("express");
const router = express.Router();


// Admin controllers
const user_admin_controller = require("../controller/admin/userController");
const venue_controller = require("../controller/admin/venueController");
const kitty_controller = require("../controller/admin/kittyController");
const interest_controller = require("../controller/admin/interestController");
const banner_controller = require("../controller/admin/bannerController");
const color_controller = require("../controller/admin/colorController");
const city_controller = require("../controller/admin/cityController");
const roles_controller = require("../controller/admin/roleController");
const activity_controller = require("../controller/admin/activityController");
const themes_controller = require("../controller/admin/themesController");
const venueCategory_controller = require("../controller/admin/venueCategoryController"); // Import the controller for venueCategory

// Client controllers
const user_controller = require("../controller/client/usercontroller");
const otp_controller = require("../controller/client/otpcontroller");
const group_controller = require("../controller/client/groupController");
const post_controller = require("../controller/client/postController");
const wishlist_controller = require("../controller/client/wishlistController");
const chat_controller = require("../controller/client/chatController");
const address_controller = require("../controller/client/addressController");
const message_controller = require("../controller/client/messageController");
const postTagController = require('../controller/client/postTagControllers');
const feedbackController = require('../controller/client/feedbackController');

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

// Color routes
router.get("/getAllColor", color_controller.getAllColor);
router.post("/addColor", color_controller.addColor);
router.get("/getColorById/:id", color_controller.getColorById);
router.put("/updateColor/:id", color_controller.updateColor);
router.delete("/deleteColor/:id", color_controller.deleteColor);
router.patch("/updateColorStatus/:id", color_controller.updateColorStatus);

// // City routes
// router.get("/getAllCity", city_controller.getAllCity);
// router.post("/addCity", city_controller.addCity);
// router.get("/getCityById/:id", city_controller.getCityById);
// router.put("/updateCity/:id", city_controller.updateCity);
// router.delete("/deleteCity/:id", city_controller.deleteCity);
// router.patch("/updateCityStatus/:id", city_controller.updateCityStatus);

//address routes
router.post('/createAddress', address_controller.createAddress);
router.get('/getAllAddresses', address_controller.getAllAddresses);
router.get('/getAddressById/:id', address_controller.getAddressById);
router.put('/updateAddressById/:id', address_controller.updateAddressById);
router.delete('/deleteAddressById/:id', address_controller.deleteAddressById);
router.get('/getAddressByUserId/:userId', address_controller.getAddressByUserId);

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

// gorup frequency routes
router.post("/addGroupFrequency", group_controller.addGroupFrequency);
router.get("/getAllGroupsFrequency", group_controller.getAllGroupsFrequency);
router.get("/getGroupFrequencyById/:id", group_controller.getGroupFrequencyById);
router.put("/updateFrequencyGroup/:id", group_controller.updateFrequencyGroup);
router.delete("/deleteFrequencyGroup/:id", group_controller.deleteFrequencyGroup);

// gorup interest routes
router.post("/addGroupInterest", group_controller.addGroupInterest);
router.get("/getAllGroupsInterest", group_controller.getAllGroupsInterest);
router.get("/getGroupInterestById/:id", group_controller.getGroupInterestById);
router.put("/updateInterestGroup/:id", group_controller.updateInterestGroup);
router.delete("/deleteInterestGroup/:id", group_controller.deleteInterestGroup);

//post routes
router.post("/addPost", post_controller.addPost);
router.post("/voteForPost", post_controller.voteForPost);
router.get("/getAllPost", post_controller.getAllPost);
router.get("/getAllPostByme/:id", post_controller.getAllPostByme);
router.get("/getPostById/:id", post_controller.getPostById);
router.put("/updatePostById/:id", post_controller.updatePostById);
router.delete("/deletePostById/:id", post_controller.deletePostById);

//wishlist routes
router.post("/addWishlist", wishlist_controller.addWishlist);
router.get("/getAllWishlist", wishlist_controller.getAllWishlist);
router.get("/getAllWishlistByme/:id", wishlist_controller.getAllWishlistByme);
router.get("/getWishlistById/:id", wishlist_controller.getWishlistById);
router.put("/updateWishlistById/:id", wishlist_controller.updateWishlistById);
router.delete("/deleteWishlistById/:id", wishlist_controller.deleteWishlistById);

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



//PostTag Routes
router.post('/posttags', postTagController.createPostTag); // Create post tag
router.get('/posttags', postTagController.getAllPostTags); // Get all post tags
router.get('/posttags/:id', postTagController.getPostTagById); // Get post tag by ID
router.put('/posttags/:id', postTagController.updatePostTag); // Update post tag by ID
router.delete('/posttags/:id', postTagController.deletePostTag); // Delete post tag by ID

//FeedBack Route
router.post('/feedback', feedbackController.createFeedback);
router.get('/feedback', feedbackController.getFeedbacks);
router.get('/feedback/:id', feedbackController.getFeedbackById);
router.put('/feedback/:id', feedbackController.updateFeedback);
router.delete('/feedback/:id', feedbackController.deleteFeedback);








module.exports = router;
