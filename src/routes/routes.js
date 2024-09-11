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
const addressController = require('../controller/client/addressController');
const message_controller = require("../controller/client/messageController");
const postTagController = require('../controller/client/postTagControllers');
const feedbackController = require('../controller/client/feedbackController');
const templateController = require('../controller/client/templateController');
const faqController = require('../controller/client/faqControllers');
const { addUserToGroup, getPendingUserIds, updateUserStatus } = require('../controller/client/requesttojoingroupController');
const bookingRequestController = require('../controller/client/bookingrequestControllers');
const postShareController = require('../controller/client/postshareControllers');
const venueTypeController = require('../controller/client/typeofvanueControllers'); 
const kittyDetailControllers = require('../controller/client/kittydetailController');
const pastFunController = require('../controller/client/pastfunControllers');












// Client routes
router.post("/sendotp", otp_controller.sendotp);
router.post("/sendotpwhatsapp", otp_controller.sendotpwhatsapp);
router.post("/verifyotp", otp_controller.verifyotp);
router.post("/isUserLoggedIn", otp_controller.isUserLoggedIn);

router.post("/adduserInfo", user_controller.adduserInfo);
router.post("/checkGender", user_controller.checkGender);
router.put("/updateUserInfo", user_controller.updateUserInfo);
router.get("/getUserDetailByMobileNumber/:phoneNumber", user_controller.getUserDetailByMobileNumber);
const messageController = require('../controller/client/postshareControllers');


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
// Route to create a new city
router.post('/createCity',city_controller.createCity);
router.get('/getAllCities',city_controller.getAllCities);
router.get('/getCityById/:id', city_controller.getCityById);
router.put('/updateCity/:id', city_controller.updateCity);
router.delete('/deleteCity/:id', city_controller.deleteCity);

//address routes
router.post('/createAddress', addressController.createAddress);
router.get('/getAllAddresses', addressController.getAllAddresses);
router.get('/getAddressById/:id', addressController.getAddressById);
router.put('/updateAddressById/:id', addressController.updateAddressById);
router.delete('/deleteAddressById/:id', addressController.deleteAddressById);
router.get('/getAddressByUserId/:userId', addressController.getAddressByUserId);


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
router.post("/toggleLike", post_controller.toggleLike);
router.post("/addComment", post_controller.addComment);
router.post("/deleteComment", post_controller.deleteComment);
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
// router.post('/filter', venue_controller.filterVenues);
router.post('/filterVenues', venue_controller.filterVenues);




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
router.post('/createPostTag', postTagController.createPostTag); // Create post tag
router.get('/getAllPostTags', postTagController.getAllPostTags); // Get all post tags
router.get('/getPostTagById/:id', postTagController.getPostTagById); // Get post tag by ID
router.put('/updatePostTag/:id', postTagController.updatePostTag); // Update post tag by ID
router.delete('/deletePostTag/:id', postTagController.deletePostTag); // Delete post tag by ID

//FeedBack Route
router.post('/createFeedback', feedbackController.createFeedback);
router.get('/getFeedbacks', feedbackController.getFeedbacks);
router.get('/getFeedbackById/:id', feedbackController.getFeedbackById);
router.put('/updateFeedback/:id', feedbackController.updateFeedback);
router.delete('/deleteFeedback/:id', feedbackController.deleteFeedback);

//Template Routes 
router.post('/createTemplate', templateController.createTemplate);
router.get('/getAllTemplates', templateController.getAllTemplates);
router.get('/getTemplateById/:id', templateController.getTemplateById);
router.put('/updateTemplateById/:id', templateController.updateTemplateById);
router.delete('/deleteTemplateById/:id', templateController.deleteTemplateById);



//FAQ Routes
router.post('/addFAQ', faqController.addFAQ);
router.get('/getAllFAQs', faqController.getAllFAQs);
router.get('/getFAQById/:id', faqController.getFAQById);
router.put('/updateFAQ/:id', faqController.updateFAQ);
router.delete('/deleteFAQ/:id', faqController.deleteFAQ);

// request to add user in group routes

router.post('/addUserToGroup', addUserToGroup);
router.get('/pendingUserIds/:groupId', getPendingUserIds);

router.put('/updateUserStatus', updateUserStatus);





//Booking request routes 
router.post('/createBookingRequest', bookingRequestController.createBookingRequest);
router.get('/getAllBookingRequests', bookingRequestController.getAllBookingRequests);
router.get('/getBookingRequestById/:id', bookingRequestController.getBookingRequestById);
router.put('/updateBookingRequestById/:id', bookingRequestController.updateBookingRequestById);
router.delete('/deleteBookingRequestById/:id', bookingRequestController.deleteBookingRequestById);



// Create a new Type
// Create a new VenueType
router.post('/createVenueType', venueTypeController.createVenueType);
router.get('/getAllVenueTypes', venueTypeController.getAllVenueTypes);
router.get('/getVenueTypeById/:id', venueTypeController.getVenueTypeById);
router.put('/updateVenueTypeById/:id', venueTypeController.updateVenueTypeById);
router.delete('/deleteVenueTypeById/:id', venueTypeController.deleteVenueTypeById);



//Share Post Routes 
router.post('/createPostShare', postShareController.createPostShare);
router.get('/getPostShares', postShareController.getPostShares);
router.get('/getPostShareById/:id', postShareController.getPostShareById);
router.put('/updatePostShare/:id', postShareController.updatePostShare);
router.delete('/deletePostShare/:id', postShareController.deletePostShare);

//kitty detail routes 
router.post('/createKittyDetail', kittyDetailControllers.createKittyDetail);
router.get('/getAllKittyDetails', kittyDetailControllers.getAllKittyDetails);
router.get('/getKittyDetailById/:id', kittyDetailControllers.getKittyDetailById);
router.put('/updateKittyDetail/:id', kittyDetailControllers.updateKittyDetail);
router.delete('/deleteKittyDetail/:id', kittyDetailControllers.deleteKittyDetail);


//past fun routes
router.post('/createPastFun', pastFunController.createPastFun);
router.get('/getAllPastFun', pastFunController.getAllPastFun);
router.get('/getPastFunById/:id', pastFunController.getPastFunById);
router.put('/updatePastFunById/:id', pastFunController.updatePastFunById);
router.delete('/deletePastFunById/:id', pastFunController.deletePastFunById);



module.exports = router;
