// routes/index.js or your specific routes file
const express = require("express");
const router = express.Router();

// Upload images to S3 bucket
const uploadImage = require("../controller/admin/s3UploadController")
const detectGender = require("../controller/admin/detectGenderController")

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
const pages_controller = require("../controller/admin/pageController");

const venueCategory_controller = require("../controller/admin/venueCategoryController"); // Import the controller for venueCategory

// Client controllers
const user_controller = require("../controller/client/usercontroller");
const otp_controller = require("../controller/client/otpcontroller");
const test_controller = require("../controller/client/testController");
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
const { addUserToGroup, getPendingRequestsByUserId, updateUserStatus } = require('../controller/client/requesttojoingroupController');
const bookingRequestController = require('../controller/client/bookingrequestControllers');
const postShareController = require('../controller/client/postshareControllers');
const venueTypeController = require('../controller/client/typeofvanueControllers'); 
const kittyDetailControllers = require('../controller/client/kittydetailController');
const pastFunController = require('../controller/client/pastfunControllers');
const venuereview_controller = require('../controller/client/venueReviewController');
const uploadImageController =require('../controller/client/KittyCreationImages/PlanKittyImageUpload');
const memoriesControllers = require('../controller/client/memoriesControllers');
const iconControllers = require('../controller/client/popupiconControllers');
const wallet_Controller = require('../controller/client/walletController');




const {
    createTermsAndServices,
    getTermsAndServices,
    getTermsAndServicesById,
    updateTermsAndServices,
    deleteTermsAndServices
  } = require('../controller/client/termsandserviceControllers');

  const walletTransactionControllers = require('../controller/client/wallettransectionhistoryControllers');
  const draftController = require('../controller/client/draftControllers');

  const pollController = require('../controller/client/pollcontrollers');

  const messageController = require('../controller/client/postshareControllers');


// S3bucket image upload route
/**
 * @swagger
 * /postImage:
 *   post:
 *     summary: Upload an image to S3 bucket
 *     tags: [Image Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       400:
 *         description: Invalid image data
 *       500:
 *         description: Server error during image upload
 */
router.post("/postImage", uploadImage.uploadImage);

/**
 * @swagger
 * /detectGender/{imageName}:
 *   get:
 *     summary: Detect gender from the uploaded image
 *     tags: [Image Upload]
 *     parameters:
 *       - name: imageName
 *         in: path
 *         required: true
 *         description: The name of the image file uploaded
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Gender detected successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 gender:
 *                   type: string
 *                   description: Detected gender from the image
 *       404:
 *         description: Image not found
 *       500:
 *         description: Server error during gender detection
 */
router.get("/detectGender/:imageName", detectGender.detectGender);


// Client routes
/**
 * @swagger
 * /sendotp:
 *   post:
 *     summary: Send OTP to user
 *     tags: [Client]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 description: The user's mobile number to send the OTP
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Invalid request data
 */
router.post("/sendotp", otp_controller.sendotp);

/**
 * @swagger
 * /sendotpwhatsapp:
 *   post:
 *     summary: Send OTP via WhatsApp
 *     tags: [Client]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 description: The user's mobile number to send the OTP
 *     responses:
 *       200:
 *         description: OTP sent via WhatsApp successfully
 *       400:
 *         description: Invalid request data
 */
router.post("/sendotpwhatsapp", otp_controller.sendotpwhatsapp);

/**
 * @swagger
 * /verifyotp:
 *   post:
 *     summary: Verify OTP sent to user
 *     tags: [Client]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 description: The user's mobile number
 *               otp:
 *                 type: string
 *                 description: The OTP to verify
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid OTP or request data
 */
router.post("/verifyotp", otp_controller.verifyotp);

/**
 * @swagger
 * /isUserLoggedIn:
 *   post:
 *     summary: Check if the user is logged in
 *     tags: [Client]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user
 *     responses:
 *       200:
 *         description: User is logged in
 *       401:
 *         description: User is not logged in
 */
router.post("/isUserLoggedIn", otp_controller.isUserLoggedIn);

/**
 * @swagger
 * /sendotptest:
 *   post:
 *     summary: Test endpoint to send OTP
 *     tags: [Client]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 description: The user's mobile number to send the OTP for testing
 *     responses:
 *       200:
 *         description: OTP sent successfully for testing
 *       400:
 *         description: Invalid request data
 */
router.post("/sendotptest", test_controller.sendotptest);

/**
 * @swagger
 * /verifyotptest:
 *   post:
 *     summary: Test endpoint to verify OTP
 *     tags: [Client]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 description: The user's mobile number
 *               otp:
 *                 type: string
 *                 description: The OTP to verify for testing
 *     responses:
 *       200:
 *         description: OTP verified successfully for testing
 *       400:
 *         description: Invalid OTP or request data
 */
router.post("/verifyotptest", test_controller.verifyotptest);

/**
 * @swagger
 * /sendotptestwhatsapp:
 *   post:
 *     summary: Test endpoint to send OTP via WhatsApp
 *     tags: [Client]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 description: The user's mobile number to send the OTP for testing via WhatsApp
 *     responses:
 *       200:
 *         description: OTP sent via WhatsApp successfully for testing
 *       400:
 *         description: Invalid request data
 */
router.post("/sendotptestwhatsapp", test_controller.sendotptestwhatsapp);



/**
 * @swagger
 * /adduserInfo:
 *   post:
 *     summary: Add user information
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the user
 *               email:
 *                 type: string
 *                 description: Email of the user
 *               phoneNumber:
 *                 type: string
 *                 description: Mobile number of the user
 *               gender:
 *                 type: string
 *                 description: Gender of the user
 *     responses:
 *       201:
 *         description: User information added successfully
 *       400:
 *         description: Invalid request data
 */
router.post("/adduserInfo", user_controller.adduserInfo);

/**
 * @swagger
 * /checkGender:
 *   post:
 *     summary: Check gender of the user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 description: Mobile number of the user
 *     responses:
 *       200:
 *         description: Gender check successful
 *       404:
 *         description: User not found
 */
router.post("/checkGender", user_controller.checkGender);

/**
 * @swagger
 * /updateUserInfo:
 *   put:
 *     summary: Update user information
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user to be updated
 *               name:
 *                 type: string
 *                 description: Updated name of the user
 *               email:
 *                 type: string
 *                 description: Updated email of the user
 *               phoneNumber:
 *                 type: string
 *                 description: Updated mobile number of the user
 *               gender:
 *                 type: string
 *                 description: Updated gender of the user
 *     responses:
 *       200:
 *         description: User information updated successfully
 *       400:
 *         description: Invalid request data
 */
router.put("/updateUserInfo", user_controller.updateUserInfo);

/**
 * @swagger
 * /getUserDetailByMobileNumber/{phoneNumber}:
 *   get:
 *     summary: Get user details by mobile number
 *     tags: [User]
 *     parameters:
 *       - name: phoneNumber
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Mobile number of the user
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *       404:
 *         description: User not found
 */
router.get("/getUserDetailByMobileNumber/:phoneNumber", user_controller.getUserDetailByMobileNumber);






// Chat routes
/**
 * @swagger
 * /createChat:
 *   post:
 *     summary: Create a new chat
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               participants:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of user IDs participating in the chat
 *     responses:
 *       201:
 *         description: Chat created successfully
 *       400:
 *         description: Invalid request data
 */
router.post("/createChat", chat_controller.createChat);

/**
 * @swagger
 * /getChats:
 *   get:
 *     summary: Retrieve all chats
 *     tags: [Chat]
 *     responses:
 *       200:
 *         description: List of chats retrieved successfully
 *       404:
 *         description: No chats found
 */
router.get("/getChats", chat_controller.getChats);

// Message routes
/**
 * @swagger
 * /createMessage:
 *   post:
 *     summary: Create a new message
 *     tags: [Message]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chatId:
 *                 type: string
 *                 description: ID of the chat the message belongs to
 *               senderId:
 *                 type: string
 *                 description: ID of the user sending the message
 *               content:
 *                 type: string
 *                 description: The content of the message
 *     responses:
 *       201:
 *         description: Message created successfully
 *       400:
 *         description: Invalid request data
 */
router.post("/createMessage", message_controller.createMessage);

/**
 * @swagger
 * /getMessages/{chatId}:
 *   get:
 *     summary: Get messages for a specific chat
 *     tags: [Message]
 *     parameters:
 *       - name: chatId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the chat to retrieve messages from
 *     responses:
 *       200:
 *         description: List of messages retrieved successfully
 *       404:
 *         description: Chat not found
 */
router.get("/getMessages/:groupId", message_controller.getMessages);

// Admin routes
/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Admin signup
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username for the admin
 *               password:
 *                 type: string
 *                 description: Password for the admin
 *     responses:
 *       201:
 *         description: Admin signed up successfully
 */
router.post("/signup", user_admin_controller.signup);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username of the admin
 *               password:
 *                 type: string
 *                 description: Password of the admin
 *     responses:
 *       200:
 *         description: Admin logged in successfully
 */
router.post("/login", user_admin_controller.login);

/**
 * @swagger
 * /getAllUsersList:
 *   get:
 *     summary: Get all users list
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of users
 */
router.get("/getAllUsersList", user_admin_controller.getAllUsersList);

/**
 * @swagger
 * /getUserKittyVenueGroupCount:
 *   get:
 *     summary: Get counts for users, kitty, venue, and group
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Successfully retrieved the counts
 */
router.get("/getUserKittyVenueGroupCount", user_admin_controller.getUserKittyVenueGroupCount);

/**
 * @swagger
 * /getuserById/{id}:
 *   get:
 *     summary: Get user details by ID
 *     tags: [Admin]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved user details
 *       404:
 *         description: User not found
 */
router.get("/getuserById/:id", user_admin_controller.getuserById);

/**
 * @swagger
 * /updateUserInfo/{id}:
 *   put:
 *     summary: Update user information by ID
 *     tags: [Admin]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the user
 *               email:
 *                 type: string
 *                 description: Updated email of the user
 *     responses:
 *       200:
 *         description: User information updated successfully
 *       404:
 *         description: User not found
 */
router.put("/updateUserInfo/:id", user_admin_controller.updateUserInfo);

/**
 * @swagger
 * /deleteUserById/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [Admin]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete("/deleteUserById/:id", user_admin_controller.deleteUserById);

/**
 * @swagger
 * /updateStatus/{id}:
 *   patch:
 *     summary: Update user status by ID
 *     tags: [Admin]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to update status
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: New status of the user
 *     responses:
 *       200:
 *         description: User status updated successfully
 *       404:
 *         description: User not found
 */
router.patch("/updateStatus/:id", user_admin_controller.updateStatus);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user image by ID
 *     tags: [Admin]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to update the image
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: User image to upload
 *     responses:
 *       200:
 *         description: User image updated successfully
 *       404:
 *         description: User not found
 */
router.put("/users/:id", user_admin_controller.updateUserImage);
router.get("/getCountOfKittyAndGroupByme/:userId", user_admin_controller.getCountOfKittyAndGroupByme);




// Interest routes
/**
 * @swagger
 * /sendInterestAndPreference:
 *   get:
 *     summary: Send user interest and preferences
 *     tags: [Interest]
 *     responses:
 *       200:
 *         description: Successfully sent interest and preferences
 */
router.get("/sendInterestAndPreference", interest_controller.sendInterestAndPreference);

/**
 * @swagger
 * /addInterest:
 *   post:
 *     summary: Add a new interest
 *     tags: [Interest]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user
 *               interest:
 *                 type: string
 *                 description: Interest to add
 *     responses:
 *       201:
 *         description: Interest added successfully
 */
router.post("/addInterest", interest_controller.addInterest);

/**
 * @swagger
 * /getInterestById/{id}:
 *   get:
 *     summary: Retrieve interest by ID
 *     tags: [Interest]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the interest to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Interest found
 *       404:
 *         description: Interest not found
 */
router.get("/getInterestById/:id", interest_controller.getInterestById);

/**
 * @swagger
 * /updateInterest/{id}:
 *   put:
 *     summary: Update an interest by ID
 *     tags: [Interest]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the interest to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               interest:
 *                 type: string
 *                 description: Updated interest
 *     responses:
 *       200:
 *         description: Interest updated successfully
 *       404:
 *         description: Interest not found
 */
router.put("/updateInterest/:id", interest_controller.updateInterest);

/**
 * @swagger
 * /deleteInterest/{id}:
 *   delete:
 *     summary: Delete an interest by ID
 *     tags: [Interest]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the interest to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Interest deleted successfully
 *       404:
 *         description: Interest not found
 */
router.delete("/deleteInterest/:id", interest_controller.deleteInterest);

/**
 * @swagger
 * /updateInterestStatus/{id}:
 *   patch:
 *     summary: Update the status of an interest by ID
 *     tags: [Interest]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the interest to update the status
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: New status of the interest
 *     responses:
 *       200:
 *         description: Interest status updated successfully
 *       404:
 *         description: Interest not found
 */
router.patch("/updateInterestStatus/:id", interest_controller.updateInterestStatus);


// Banner routes
/**
 * @swagger
 * /getAllBanner:
 *   get:
 *     summary: Retrieve all banners
 *     tags: [Banner]
 *     responses:
 *       200:
 *         description: A list of banners
 */
router.get("/getAllBanner", banner_controller.getAllBanner);

/**
 * @swagger
 * /addBanner:
 *   post:
 *     summary: Add a new banner
 *     tags: [Banner]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the banner
 *               imageUrl:
 *                 type: string
 *                 description: URL of the banner image
 *               link:
 *                 type: string
 *                 description: Link associated with the banner
 *     responses:
 *       201:
 *         description: Banner added successfully
 */
router.post("/addBanner", banner_controller.addBanner);

/**
 * @swagger
 * /getBannerById/{id}:
 *   get:
 *     summary: Retrieve a banner by ID
 *     tags: [Banner]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the banner to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Banner found
 *       404:
 *         description: Banner not found
 */
router.get("/getBannerById/:id", banner_controller.getBannerById);

/**
 * @swagger
 * /updateBanner/{id}:
 *   put:
 *     summary: Update a banner by ID
 *     tags: [Banner]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the banner to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               link:
 *                 type: string
 *     responses:
 *       200:
 *         description: Banner updated successfully
 *       404:
 *         description: Banner not found
 */
router.put("/updateBanner/:id", banner_controller.updateBanner);

/**
 * @swagger
 * /deleteBanner/{id}:
 *   delete:
 *     summary: Delete a banner by ID
 *     tags: [Banner]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the banner to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Banner deleted successfully
 *       404:
 *         description: Banner not found
 */
router.delete("/deleteBanner/:id", banner_controller.deleteBanner);

/**
 * @swagger
 * /updateBannerStatus/{id}:
 *   patch:
 *     summary: Update the status of a banner by ID
 *     tags: [Banner]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the banner to update the status
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: New status of the banner
 *     responses:
 *       200:
 *         description: Banner status updated successfully
 *       404:
 *         description: Banner not found
 */
router.patch("/updateBannerStatus/:id", banner_controller.updateBannerStatus);

// Color routes
/**
 * @swagger
 * /getAllColor:
 *   get:
 *     summary: Retrieve all colors
 *     tags: [Color]
 *     responses:
 *       200:
 *         description: A list of colors
 */
router.get("/getAllColor", color_controller.getAllColor);

/**
 * @swagger
 * /addColor:
 *   post:
 *     summary: Add a new color
 *     tags: [Color]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the color
 *               hexCode:
 *                 type: string
 *                 description: Hexadecimal code of the color
 *     responses:
 *       201:
 *         description: Color added successfully
 */
router.post("/addColor", color_controller.addColor);

/**
 * @swagger
 * /getColorById/{id}:
 *   get:
 *     summary: Retrieve a color by ID
 *     tags: [Color]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the color to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Color found
 *       404:
 *         description: Color not found
 */
router.get("/getColorById/:id", color_controller.getColorById);

/**
 * @swagger
 * /updateColor/{id}:
 *   put:
 *     summary: Update a color by ID
 *     tags: [Color]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the color to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               hexCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Color updated successfully
 *       404:
 *         description: Color not found
 */
router.put("/updateColor/:id", color_controller.updateColor);

/**
 * @swagger
 * /deleteColor/{id}:
 *   delete:
 *     summary: Delete a color by ID
 *     tags: [Color]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the color to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Color deleted successfully
 *       404:
 *         description: Color not found
 */
router.delete("/deleteColor/:id", color_controller.deleteColor);

/**
 * @swagger
 * /updateColorStatus/{id}:
 *   patch:
 *     summary: Update the status of a color by ID
 *     tags: [Color]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the color to update the status
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: New status of the color
 *     responses:
 *       200:
 *         description: Color status updated successfully
 *       404:
 *         description: Color not found
 */
router.patch("/updateColorStatus/:id", color_controller.updateColorStatus);

// // City routes
/**
 * @swagger
 * /createCity:
 *   post:
 *     summary: Create a new city
 *     tags: [City]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the city
 *               state:
 *                 type: string
 *                 description: State where the city is located
 *               country:
 *                 type: string
 *                 description: Country where the city is located
 *     responses:
 *       201:
 *         description: City created successfully
 */
router.post('/createCity', city_controller.createCity);

/**
 * @swagger
 * /getAllCities:
 *   get:
 *     summary: Retrieve all cities
 *     tags: [City]
 *     responses:
 *       200:
 *         description: A list of cities
 */
router.get('/getAllCities', city_controller.getAllCities);

/**
 * @swagger
 * /getCityById/{id}:
 *   get:
 *     summary: Retrieve a city by ID
 *     tags: [City]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the city to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: City found
 *       404:
 *         description: City not found
 */
router.get('/getCityById/:id', city_controller.getCityById);

/**
 * @swagger
 * /updateCity/{id}:
 *   put:
 *     summary: Update a city by ID
 *     tags: [City]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the city to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               state:
 *                 type: string
 *               country:
 *                 type: string
 *     responses:
 *       200:
 *         description: City updated successfully
 *       404:
 *         description: City not found
 */
router.put('/updateCity/:id', city_controller.updateCity);

/**
 * @swagger
 * /deleteCity/{id}:
 *   delete:
 *     summary: Delete a city by ID
 *     tags: [City]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the city to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: City deleted successfully
 *       404:
 *         description: City not found
 */
router.delete('/deleteCity/:id', city_controller.deleteCity);

//address routes
/**
 * @swagger
 * /createAddress:
 *   post:
 *     summary: Create a new address
 *     tags: [Address]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               street:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               zipCode:
 *                 type: string
 *     responses:
 *       201:
 *         description: Address created successfully
 */
router.post('/createAddress', addressController.createAddress);

/**
 * @swagger
 * /getAllAddresses:
 *   get:
 *     summary: Retrieve all addresses
 *     tags: [Address]
 *     responses:
 *       200:
 *         description: A list of addresses
 */
router.get('/getAllAddresses', addressController.getAllAddresses);

/**
 * @swagger
 * /getAddressById/{id}:
 *   get:
 *     summary: Retrieve an address by ID
 *     tags: [Address]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the address to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Address found
 *       404:
 *         description: Address not found
 */
router.get('/getAddressById/:id', addressController.getAddressById);

/**
 * @swagger
 * /updateAddressById/{id}:
 *   put:
 *     summary: Update an address by ID
 *     tags: [Address]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the address to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               street:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               zipCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Address updated successfully
 *       404:
 *         description: Address not found
 */
router.put('/updateAddressById/:id', addressController.updateAddressById);

/**
 * @swagger
 * /deleteAddressById/{id}:
 *   delete:
 *     summary: Delete an address by ID
 *     tags: [Address]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the address to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Address deleted successfully
 *       404:
 *         description: Address not found
 */
router.delete('/deleteAddressById/:id', addressController.deleteAddressById);

/**
 * @swagger
 * /getAddressByUserId/{userId}:
 *   get:
 *     summary: Retrieve all addresses by user ID
 *     tags: [Address]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID of the user to retrieve addresses for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of addresses for the user
 *       404:
 *         description: No addresses found for the user
 */
router.get('/getAddressByUserId/:userId', addressController.getAddressByUserId);


// Activity routes
/**
 * @swagger
 * /getAllActivity:
 *   get:
 *     summary: Retrieve all activities
 *     tags: [Activity]
 *     responses:
 *       200:
 *         description: A list of activities
 */
router.get("/getAllActivity", activity_controller.getAllActivity);
router.get("/getAllActivityOfUser/:id", activity_controller.getAllActivity);


/**
 * @swagger
 * /addActivity:
 *   post:
 *     summary: Add a new activity
 *     tags: [Activity]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Activity added successfully
 */
router.post("/addActivity", activity_controller.addActivity);

/**
 * @swagger
 * /getActivityById/{id}:
 *   get:
 *     summary: Retrieve an activity by ID
 *     tags: [Activity]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the activity to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Activity found
 *       404:
 *         description: Activity not found
 */
router.get("/getActivityById/:id", activity_controller.getActivityById);

/**
 * @swagger
 * /updateActivity/{id}:
 *   put:
 *     summary: Update an activity by ID
 *     tags: [Activity]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the activity to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Activity updated successfully
 *       404:
 *         description: Activity not found
 */
router.put("/updateActivity/:id", activity_controller.updateActivity);

/**
 * @swagger
 * /deleteActivity/{id}:
 *   delete:
 *     summary: Delete an activity by ID
 *     tags: [Activity]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the activity to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Activity deleted successfully
 *       404:
 *         description: Activity not found
 */
router.delete("/deleteActivity/:id", activity_controller.deleteActivity);

/**
 * @swagger
 * /updateActivityStatus/{id}:
 *   patch:
 *     summary: Update the status of an activity by ID
 *     tags: [Activity]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the activity to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Activity status updated successfully
 *       404:
 *         description: Activity not found
 */
router.patch("/updateActivityStatus/:id", activity_controller.updateActivityStatus);


// Roles routes
/**
 * @swagger
 * /getAllRoles:
 *   get:
 *     summary: Retrieve all roles
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: A list of roles
 */
router.get("/getAllRoles", roles_controller.getAllRoles);

/**
 * @swagger
 * /addRoles:
 *   post:
 *     summary: Add a new role
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Role added successfully
 */
router.post("/addRoles", roles_controller.addRoles);

/**
 * @swagger
 * /getRolesById/{id}:
 *   get:
 *     summary: Retrieve a role by ID
 *     tags: [Roles]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the role to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Role found
 *       404:
 *         description: Role not found
 */
router.get("/getRolesById/:id", roles_controller.getRolesById);

/**
 * @swagger
 * /updateRoles/{id}:
 *   put:
 *     summary: Update a role by ID
 *     tags: [Roles]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the role to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       404:
 *         description: Role not found
 */
router.put("/updateRoles/:id", roles_controller.updateRoles);

/**
 * @swagger
 * /deleteRoles/{id}:
 *   delete:
 *     summary: Delete a role by ID
 *     tags: [Roles]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the role to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Role deleted successfully
 *       404:
 *         description: Role not found
 */
router.delete("/deleteRoles/:id", roles_controller.deleteRoles);

/**
 * @swagger
 * /getAllThemes:
 *   get:
 *     summary: Retrieve all themes
 *     tags: [Themes]
 *     responses:
 *       200:
 *         description: A list of themes
 */
router.get("/getAllThemes", themes_controller.getAllThemes);

router.get("/getAllPages", pages_controller.getAllPages);
router.post("/addPage", pages_controller.addPage);


/**
 * @swagger
 * /addThemes:
 *   post:
 *     summary: Add a new theme
 *     tags: [Themes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Theme added successfully
 */
router.post("/addThemes", themes_controller.addThemes);

/**
 * @swagger
 * /getThemesById/{id}:
 *   get:
 *     summary: Retrieve a theme by ID
 *     tags: [Themes]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the theme to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Theme found
 *       404:
 *         description: Theme not found
 */
router.get("/getThemesById/:id", themes_controller.getThemesById);

/**
 * @swagger
 * /updateThemes/{id}:
 *   put:
 *     summary: Update a theme by ID
 *     tags: [Themes]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the theme to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Theme updated successfully
 *       404:
 *         description: Theme not found
 */
router.put("/updateThemes/:id", themes_controller.updateThemes);

/**
 * @swagger
 * /deleteThemes/{id}:
 *   delete:
 *     summary: Delete a theme by ID
 *     tags: [Themes]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the theme to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Theme deleted successfully
 *       404:
 *         description: Theme not found
 */
router.delete("/deleteThemes/:id", themes_controller.deleteThemes);

/**
 * @swagger
 * /updateThemesStatus/{id}:
 *   patch:
 *     summary: Update the status of a theme by ID
 *     tags: [Themes]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the theme to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Theme status updated successfully
 *       404:
 *         description: Theme not found
 */
router.patch("/updateThemesStatus/:id", themes_controller.updateThemesStatus);

// Group routes
/**
 * @swagger
 * tags:
 *   name: Groups
 *   description: Group management API
 */

/**
 * @swagger
 * /addGroup:
 *   post:
 *     summary: Add a new group
 *     tags: [Groups]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               hostId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Group created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/addGroup", group_controller.addGroup);

/**
 * @swagger
 * /addGroupMemories:
 *   post:
 *     summary: Add memories to a group
 *     tags: [Groups]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               groupId:
 *                 type: string
 *               memories:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Memories added successfully
 *       400:
 *         description: Invalid input
 */
router.post("/addGroupMemories", group_controller.addGroupMemories);

/**
 * @swagger
 * /getAllGroups:
 *   get:
 *     summary: Retrieve all groups
 *     tags: [Groups]
 *     responses:
 *       200:
 *         description: A list of groups
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   hostId:
 *                     type: string
 */
router.get("/getAllGroups", group_controller.getAllGroups);

/**
 * @swagger
 * /getGroupById/{id}:
 *   get:
 *     summary: Retrieve a group by ID
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the group to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Group details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 hostId:
 *                   type: string
 *       404:
 *         description: Group not found
 */
router.get("/getGroupById/:id", group_controller.getGroupById);

/**
 * @swagger
 * /getGroupHostedByMe/{id}:
 *   get:
 *     summary: Retrieve groups hosted by a specific user
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Groups hosted by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 */
router.get("/getGroupHostedByMe/:id", group_controller.getGroupHostedByMe);

/**
 * @swagger
 * /getGroupDetails/{groupId}:
 *   get:
 *     summary: Retrieve detailed information about a group
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         description: The ID of the group to retrieve details for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Group details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 hostId:
 *                   type: string
 *       404:
 *         description: Group not found
 */
router.get("/getGroupDetails/:groupId", group_controller.getGroupDetails);

/**
 * @swagger
 * /updateGroup/{id}:
 *   put:
 *     summary: Update a group by ID
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the group to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Group updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Group not found
 */
router.put("/updateGroup/:id", group_controller.updateGroup);

/**
 * @swagger
 * /deleteGroup/{id}:
 *   delete:
 *     summary: Delete a group by ID
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the group to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Group deleted successfully
 *       404:
 *         description: Group not found
 */
router.delete("/deleteGroup/:id", group_controller.deleteGroup);

/**
 * @swagger
 * /updateGroupStatus/{id}:
 *   patch:
 *     summary: Update the status of a group by ID
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the group to update status
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Group status updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Group not found
 */
router.patch("/updateGroupStatus/:id", group_controller.updateStatus);

/**
 * @swagger
 * /join-by-referral/{groupId}:
 *   post:
 *     summary: Join a group by referral code
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         description: The ID of the group to join
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               referralCode:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successfully joined the group
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Group not found
 */
router.post('/join-by-referral/:groupId', group_controller.joinGroupByReferralCode);
router.post('/generateReferalCode/:groupId', group_controller.generateReferalCode);



//spin route
/**
 * @swagger
 * /spin/{groupId}:
 *   get:
 *     summary: Perform a spin for a specific group
 *     tags: [spin]
 *     parameters:
 *       - name: groupId
 *         in: path
 *         required: true
 *         description: ID of the group to perform the spin on
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Spin performed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the spin was successful
 *                 result:
 *                   type: string
 *                   description: Result of the spin operation
 *       404:
 *         description: Group not found
 *       500:
 *         description: Server error
 */
router.get('/spin/:groupId', group_controller.performSpin);

// gorup frequency routes
/**
 * @swagger
 * /addGroupFrequency:
 *   post:
 *     summary: Add a new group frequency
 *     tags: [Group Frequency]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               frequency:
 *                 type: string
 *                 description: Frequency of the group (e.g., weekly, monthly)
 *               description:
 *                 type: string
 *                 description: Description of the group frequency
 *     responses:
 *       201:
 *         description: Group frequency created successfully
 *       400:
 *         description: Bad request (e.g., missing fields)
 *       500:
 *         description: Server error
 */
router.post("/addGroupFrequency", group_controller.addGroupFrequency);

/**
 * @swagger
 * /getAllGroupsFrequency:
 *   get:
 *     summary: Retrieve all group frequencies
 *     tags: [Group Frequency]
 *     responses:
 *       200:
 *         description: A list of all group frequencies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   frequency:
 *                     type: string
 *                   description:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get("/getAllGroupsFrequency", group_controller.getAllGroupsFrequency);

/**
 * @swagger
 * /getGroupFrequencyById/{id}:
 *   get:
 *     summary: Retrieve a specific group frequency by ID
 *     tags: [Group Frequency]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the group frequency to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Group frequency retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 frequency:
 *                   type: string
 *                 description:
 *                   type: string
 *       404:
 *         description: Group frequency not found
 *       500:
 *         description: Server error
 */
router.get("/getGroupFrequencyById/:id", group_controller.getGroupFrequencyById);

/**
 * @swagger
 * /updateFrequencyGroup/{id}:
 *   put:
 *     summary: Update a specific group frequency by ID
 *     tags: [Group Frequency]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the group frequency to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               frequency:
 *                 type: string
 *                 description: Updated frequency of the group
 *               description:
 *                 type: string
 *                 description: Updated description of the group frequency
 *     responses:
 *       200:
 *         description: Group frequency updated successfully
 *       400:
 *         description: Bad request (e.g., invalid input)
 *       404:
 *         description: Group frequency not found
 *       500:
 *         description: Server error
 */
router.put("/updateFrequencyGroup/:id", group_controller.updateFrequencyGroup);

/**
 * @swagger
 * /deleteFrequencyGroup/{id}:
 *   delete:
 *     summary: Delete a specific group frequency by ID
 *     tags: [Group Frequency]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the group frequency to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Group frequency deleted successfully
 *       404:
 *         description: Group frequency not found
 *       500:
 *         description: Server error
 */
router.delete("/deleteFrequencyGroup/:id", group_controller.deleteFrequencyGroup);


// gorup interest routes
/**
 * @swagger
 * /addGroupInterest:
 *   post:
 *     summary: Add a new group interest
 *     tags: [Group Interest]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the group interest
 *               description:
 *                 type: string
 *                 description: Description of the group interest
 *     responses:
 *       201:
 *         description: Group interest created successfully
 *       400:
 *         description: Bad request (e.g., missing fields)
 *       500:
 *         description: Server error
 */
router.post("/addGroupInterest", group_controller.addGroupInterest);

/**
 * @swagger
 * /getAllGroupsInterest:
 *   get:
 *     summary: Retrieve all group interests
 *     tags: [Group Interest]
 *     responses:
 *       200:
 *         description: A list of all group interests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get("/getAllGroupsInterest", group_controller.getAllGroupsInterest);

/**
 * @swagger
 * /getGroupInterestById/{id}:
 *   get:
 *     summary: Retrieve a specific group interest by ID
 *     tags: [Group Interest]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the group interest to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Group interest retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *       404:
 *         description: Group interest not found
 *       500:
 *         description: Server error
 */
router.get("/getGroupInterestById/:id", group_controller.getGroupInterestById);

/**
 * @swagger
 * /updateInterestGroup/{id}:
 *   put:
 *     summary: Update a specific group interest by ID
 *     tags: [Group Interest]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the group interest to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the group interest
 *               description:
 *                 type: string
 *                 description: Updated description of the group interest
 *     responses:
 *       200:
 *         description: Group interest updated successfully
 *       400:
 *         description: Bad request (e.g., invalid input)
 *       404:
 *         description: Group interest not found
 *       500:
 *         description: Server error
 */
router.put("/updateInterestGroup/:id", group_controller.updateInterestGroup);

/**
 * @swagger
 * /deleteInterestGroup/{id}:
 *   delete:
 *     summary: Delete a specific group interest by ID
 *     tags: [Group Interest]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the group interest to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Group interest deleted successfully
 *       404:
 *         description: Group interest not found
 *       500:
 *         description: Server error
 */
router.delete("/deleteInterestGroup/:id", group_controller.deleteInterestGroup);

//post routes
/**
 * @swagger
 * /addPost:
 *   post:
 *     summary: Add a new post
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the post
 *               content:
 *                 type: string
 *                 description: Content of the post
 *               userId:
 *                 type: string
 *                 description: ID of the user creating the post
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Bad request (e.g., missing fields)
 *       500:
 *         description: Server error
 */
router.post("/addPost", post_controller.addPost);

/**
 * @swagger
 * /voteForPost:
 *   post:
 *     summary: Vote for a post
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *                 description: ID of the post to vote for
 *               userId:
 *                 type: string
 *                 description: ID of the user voting
 *               voteType:
 *                 type: string
 *                 enum: [upvote, downvote]
 *                 description: Type of vote
 *     responses:
 *       200:
 *         description: Vote registered successfully
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.post("/voteForPost", post_controller.voteForPost);

/**
 * @swagger
 * /toggleLike:
 *   post:
 *     summary: Toggle like status for a post
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *                 description: ID of the post to like/unlike
 *               userId:
 *                 type: string
 *                 description: ID of the user liking/unliking the post
 *     responses:
 *       200:
 *         description: Like status toggled successfully
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.post("/toggleLike", post_controller.toggleLike);

/**
 * @swagger
 * /addComment:
 *   post:
 *     summary: Add a comment to a post
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *                 description: ID of the post to comment on
 *               userId:
 *                 type: string
 *                 description: ID of the user commenting
 *               comment:
 *                 type: string
 *                 description: Content of the comment
 *     responses:
 *       201:
 *         description: Comment added successfully
 *       400:
 *         description: Bad request (e.g., missing fields)
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.post("/addComment", post_controller.addComment);

/**
 * @swagger
 * /getAllComments:
 *   post:
 *     summary: Retrieve all comments for a specific post
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *                 description: ID of the post to get comments for
 *     responses:
 *       200:
 *         description: List of comments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   postId:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   comment:
 *                     type: string
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.post("/getAllComments", post_controller.getAllComments);

/**
 * @swagger
 * /deleteComment:
 *   post:
 *     summary: Delete a comment by ID
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commentId:
 *                 type: string
 *                 description: ID of the comment to delete
 *     responses:
 *       204:
 *         description: Comment deleted successfully
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
router.post("/deleteComment", post_controller.deleteComment);

/**
 * @swagger
 * /getAllPost:
 *   get:
 *     summary: Retrieve all posts
 *     tags: [Post]
 *     responses:
 *       200:
 *         description: A list of all posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   content:
 *                     type: string
 *                   userId:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get("/getAllPost", post_controller.getAllPost);

/**
 * @swagger
 * /getAllPostByme/{id}:
 *   get:
 *     summary: Retrieve all posts by a specific user
 *     tags: [Post]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to retrieve posts for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of posts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   content:
 *                     type: string
 *                   userId:
 *                     type: string
 *       404:
 *         description: User not found or no posts available
 *       500:
 *         description: Server error
 */
router.get("/getAllPostByme/:id", post_controller.getAllPostByme);

/**
 * @swagger
 * /getPostById/{id}:
 *   get:
 *     summary: Retrieve a specific post by ID
 *     tags: [Post]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the post to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 userId:
 *                   type: string
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.get("/getPostById/:id", post_controller.getPostById);

/**
 * @swagger
 * /updatePostById/{id}:
 *   put:
 *     summary: Update a specific post by ID
 *     tags: [Post]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the post to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Updated title of the post
 *               content:
 *                 type: string
 *                 description: Updated content of the post
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       400:
 *         description: Bad request (e.g., invalid input)
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.put("/updatePostById/:id", post_controller.updatePostById);

/**
 * @swagger
 * /deletePostById/{id}:
 *   delete:
 *     summary: Delete a specific post by ID
 *     tags: [Post]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the post to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Post deleted successfully
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.delete("/deletePostById/:id", post_controller.deletePostById);

/**
 * @swagger
 * /replies:
 *   post:
 *     summary: Add a reply to a comment
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commentId:
 *                 type: string
 *                 description: ID of the comment to reply to
 *               userId:
 *                 type: string
 *                 description: ID of the user replying
 *               reply:
 *                 type: string
 *                 description: Content of the reply
 *     responses:
 *       201:
 *         description: Reply added successfully
 *       400:
 *         description: Bad request (e.g., missing fields)
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
router.post("/replies", post_controller.addReply);



//wishlist routes
/**
 * @swagger
 * /addWishlist:
 *   post:
 *     summary: Add a new item to the wishlist
 *     tags: [Wishlist]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user adding the wishlist item
 *               itemId:
 *                 type: string
 *                 description: ID of the item to add to the wishlist
 *               notes:
 *                 type: string
 *                 description: Optional notes about the wishlist item
 *     responses:
 *       201:
 *         description: Wishlist item created successfully
 *       400:
 *         description: Bad request (e.g., invalid input)
 *       500:
 *         description: Server error
 */
router.post("/addWishlist", wishlist_controller.addWishlist);

/**
 * @swagger
 * /getAllWishlist:
 *   get:
 *     summary: Retrieve all wishlist items
 *     tags: [Wishlist]
 *     responses:
 *       200:
 *         description: A list of all wishlist items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   itemId:
 *                     type: string
 *                   notes:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get("/getAllWishlist", wishlist_controller.getAllWishlist);

/**
 * @swagger
 * /getAllWishlistByme/{id}:
 *   get:
 *     summary: Retrieve all wishlist items for a specific user
 *     tags: [Wishlist]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to retrieve wishlist items for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of wishlist items for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   itemId:
 *                     type: string
 *                   notes:
 *                     type: string
 *       404:
 *         description: User not found or no wishlist items
 *       500:
 *         description: Server error
 */
router.get("/getAllWishlistByme/:id", wishlist_controller.getAllWishlistByme);

/**
 * @swagger
 * /getWishlistById/{id}:
 *   get:
 *     summary: Retrieve a specific wishlist item by ID
 *     tags: [Wishlist]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the wishlist item to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Wishlist item retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 itemId:
 *                   type: string
 *                 notes:
 *                   type: string
 *       404:
 *         description: Wishlist item not found
 *       500:
 *         description: Server error
 */
router.get("/getWishlistById/:id", wishlist_controller.getWishlistById);

/**
 * @swagger
 * /updateWishlistById/{id}:
 *   put:
 *     summary: Update a wishlist item by ID
 *     tags: [Wishlist]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the wishlist item to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user (optional)
 *               itemId:
 *                 type: string
 *                 description: Updated ID of the item (optional)
 *               notes:
 *                 type: string
 *                 description: Updated notes about the wishlist item (optional)
 *     responses:
 *       200:
 *         description: Wishlist item updated successfully
 *       400:
 *         description: Bad request (e.g., invalid input)
 *       404:
 *         description: Wishlist item not found
 *       500:
 *         description: Server error
 */
router.put("/updateWishlistById/:id", wishlist_controller.updateWishlistById);

/**
 * @swagger
 * /deleteWishlistById/{id}:
 *   delete:
 *     summary: Delete a wishlist item by ID
 *     tags: [Wishlist]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the wishlist item to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Wishlist item deleted successfully
 *       404:
 *         description: Wishlist item not found
 *       500:
 *         description: Server error
 */
router.delete("/deleteWishlistById/:id", wishlist_controller.deleteWishlistById);

// Venue routes
/**
 * @swagger
 * /addVenue:
 *   post:
 *     summary: Add a new venue
 *     tags: [Venue]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the venue
 *               location:
 *                 type: string
 *                 description: Location of the venue
 *               capacity:
 *                 type: integer
 *                 description: Capacity of the venue
 *               description:
 *                 type: string
 *                 description: Description of the venue (optional)
 *     responses:
 *       201:
 *         description: Venue created successfully
 *       400:
 *         description: Bad request (e.g., invalid input)
 *       500:
 *         description: Server error
 */
router.post("/addVenue", venue_controller.addVenue);

/**
 * @swagger
 * /getAllVenues:
 *   get:
 *     summary: Retrieve all venues
 *     tags: [Venue]
 *     responses:
 *       200:
 *         description: A list of venues
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   location:
 *                     type: string
 *                   capacity:
 *                     type: integer
 *                   description:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get("/getAllVenues", venue_controller.getAllVenues);

/**
 * @swagger
 * /getVenueById/{id}:
 *   get:
 *     summary: Retrieve a venue by ID
 *     tags: [Venue]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the venue to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Venue retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 location:
 *                   type: string
 *                 capacity:
 *                   type: integer
 *                 description:
 *                   type: string
 *       404:
 *         description: Venue not found
 *       500:
 *         description: Server error
 */
router.get("/getVenueById/:id", venue_controller.getVenueById);

/**
 * @swagger
 * /updateVenue/{id}:
 *   put:
 *     summary: Update a venue by ID
 *     tags: [Venue]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the venue to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the venue
 *               location:
 *                 type: string
 *                 description: Updated location of the venue
 *               capacity:
 *                 type: integer
 *                 description: Updated capacity of the venue
 *               description:
 *                 type: string
 *                 description: Updated description of the venue (optional)
 *     responses:
 *       200:
 *         description: Venue updated successfully
 *       400:
 *         description: Bad request (e.g., invalid input)
 *       404:
 *         description: Venue not found
 *       500:
 *         description: Server error
 */
router.put("/updateVenue/:id", venue_controller.updateVenue);

/**
 * @swagger
 * /deleteVenue/{id}:
 *   delete:
 *     summary: Delete a venue by ID
 *     tags: [Venue]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the venue to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Venue deleted successfully
 *       404:
 *         description: Venue not found
 *       500:
 *         description: Server error
 */
router.delete("/deleteVenue/:id", venue_controller.deleteVenue);

/**
 * @swagger
 * /updateVenueStatus/{id}:
 *   patch:
 *     summary: Update the status of a venue by ID
 *     tags: [Venue]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the venue to update the status
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: Updated status of the venue (e.g., active, inactive)
 *     responses:
 *       200:
 *         description: Venue status updated successfully
 *       400:
 *         description: Bad request (e.g., invalid input)
 *       404:
 *         description: Venue not found
 *       500:
 *         description: Server error
 */
router.patch("/updateVenueStatus/:id", venue_controller.updateStatus);

/**
 * @swagger
 * /getFilteredVenues:
 *   get:
 *     summary: Retrieve filtered venues based on query parameters
 *     tags: [Venue]
 *     parameters:
 *       - name: location
 *         in: query
 *         description: Filter by location
 *         schema:
 *           type: string
 *       - name: capacity
 *         in: query
 *         description: Filter by capacity
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of filtered venues
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   location:
 *                     type: string
 *                   capacity:
 *                     type: integer
 *                   description:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get('/getFilteredVenues', venue_controller.getFilteredVenues);



// VenueCategory routes
/**
 * @swagger
 * /addVenueCategory:
 *   post:
 *     summary: Create a new venue category
 *     tags: [Venue Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the venue category
 *               description:
 *                 type: string
 *                 description: Description of the venue category (optional)
 *     responses:
 *       201:
 *         description: Venue category created successfully
 *       400:
 *         description: Bad request (e.g., invalid input)
 *       500:
 *         description: Server error
 */
router.post("/addVenueCategory", venueCategory_controller.createVenueCategory);

/**
 * @swagger
 * /getAllVenueCategories:
 *   get:
 *     summary: Retrieve all venue categories
 *     tags: [Venue Category]
 *     responses:
 *       200:
 *         description: A list of venue categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get("/getAllVenueCategories", venueCategory_controller.getAllVenueCategories);

/**
 * @swagger
 * /getVenueCategoryById/{id}:
 *   get:
 *     summary: Retrieve a venue category by ID
 *     tags: [Venue Category]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the venue category to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Venue category retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *       404:
 *         description: Venue category not found
 *       500:
 *         description: Server error
 */
router.get("/getVenueCategoryById/:id", venueCategory_controller.getVenueCategoryById);

/**
 * @swagger
 * /updateVenueCategory/{id}:
 *   put:
 *     summary: Update a venue category by ID
 *     tags: [Venue Category]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the venue category to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the venue category
 *               description:
 *                 type: string
 *                 description: Updated description of the venue category (optional)
 *     responses:
 *       200:
 *         description: Venue category updated successfully
 *       400:
 *         description: Bad request (e.g., invalid input)
 *       404:
 *         description: Venue category not found
 *       500:
 *         description: Server error
 */
router.put("/updateVenueCategory/:id", venueCategory_controller.updateVenueCategory);

/**
 * @swagger
 * /deleteVenueCategory/{id}:
 *   delete:
 *     summary: Delete a venue category by ID
 *     tags: [Venue Category]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the venue category to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Venue category deleted successfully
 *       404:
 *         description: Venue category not found
 *       500:
 *         description: Server error
 */
router.delete("/deleteVenueCategory/:id", venueCategory_controller.deleteVenueCategory);







/**
 * @swagger
 * /getAllKittys:
 *   get:
 *     summary: Retrieve all kitties
 *     tags: [Kitty]
 *     responses:
 *       200:
 *         description: A list of kitties
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   status:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get("/getAllKittys", kitty_controller.getAllKittys);
router.get("/getKittyAttendance/:userId", kitty_controller.getKittyAttendance);
/**
 * @swagger
 * /getAllPastAndFutureKitties:
 *   get:
 *     summary: Retrieve all past and future kitties
 *     tags: [Kitty]
 *     responses:
 *       200:
 *         description: A list of past and future kitties
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   status:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get("/getAllPastAndFutureKitties", kitty_controller.getAllPastAndFutureKitties);

/**
 * @swagger
 * /addKitty:
 *   post:
 *     summary: Add a new kitty
 *     tags: [Kitty]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the kitty
 *               status:
 *                 type: string
 *                 description: Status of the kitty
 *     responses:
 *       201:
 *         description: Kitty added successfully
 *       400:
 *         description: Bad request (e.g., invalid input)
 *       500:
 *         description: Server error
 */
router.post("/addKitty", kitty_controller.addKitty);
router.put("/updateKitty/:kittyId", kitty_controller.updateKitty);


/**
 * @swagger
 * /joinKitty:
 *   post:
 *     summary: Join a kitty
 *     tags: [Kitty]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               kittyId:
 *                 type: string
 *                 description: ID of the kitty to join
 *               userId:
 *                 type: string
 *                 description: ID of the user joining the kitty
 *     responses:
 *       200:
 *         description: User joined the kitty successfully
 *       404:
 *         description: Kitty not found
 *       500:
 *         description: Server error
 */
router.post("/joinKitty", kitty_controller.joinKitty);

/**
 * @swagger
 * /acceptOrRejectRequestOfKitty:
 *   post:
 *     summary: Accept or reject a request to join a kitty
 *     tags: [Kitty]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               requestId:
 *                 type: string
 *                 description: ID of the request to accept or reject
 *               action:
 *                 type: string
 *                 enum: [accept, reject]
 *                 description: Action to take on the request
 *     responses:
 *       200:
 *         description: Request processed successfully
 *       404:
 *         description: Request not found
 *       500:
 *         description: Server error
 */
router.post("/acceptOrRejectRequestOfKitty", kitty_controller.acceptOrRejectRequestOfKitty);

/**
 * @swagger
 * /getKittyById/{id}:
 *   get:
 *     summary: Retrieve a kitty by ID
 *     tags: [Kitty]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the kitty to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Kitty retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 status:
 *                   type: string
 *       404:
 *         description: Kitty not found
 *       500:
 *         description: Server error
 */
router.get("/getKittyById/:id", kitty_controller.getKittyById);

/**
 * @swagger
 * /deleteKitty/{id}:
 *   delete:
 *     summary: Delete a kitty by ID
 *     tags: [Kitty]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the kitty to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Kitty deleted successfully
 *       404:
 *         description: Kitty not found
 *       500:
 *         description: Server error
 */
router.delete("/deleteKitty/:id", kitty_controller.deleteKittyById);

/**
 * @swagger
 * /updateKittyStatus/{id}:
 *   patch:
 *     summary: Update the status of a kitty by ID
 *     tags: [Kitty]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the kitty to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: Updated status of the kitty
 *     responses:
 *       200:
 *         description: Kitty status updated successfully
 *       400:
 *         description: Bad request (e.g., invalid input)
 *       404:
 *         description: Kitty not found
 *       500:
 *         description: Server error
 */
router.patch("/updateKittyStatus/:id", kitty_controller.updateKittyStatus);


//PostTag Routes
/**
 * @swagger
 * /createPostTag:
 *   post:
 *     summary: Create a new post tag
 *     tags: [PostTag]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the post tag
 *     responses:
 *       201:
 *         description: Post tag created successfully
 *       400:
 *         description: Bad request (e.g., invalid input)
 *       500:
 *         description: Server error
 */
router.post('/createPostTag', postTagController.createPostTag);

/**
 * @swagger
 * /getAllPostTags:
 *   get:
 *     summary: Retrieve all post tags
 *     tags: [PostTag]
 *     responses:
 *       200:
 *         description: A list of post tags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get('/getAllPostTags', postTagController.getAllPostTags);

/**
 * @swagger
 * /getPostTagById/{id}:
 *   get:
 *     summary: Retrieve a specific post tag by ID
 *     tags: [PostTag]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the post tag to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post tag retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *       404:
 *         description: Post tag not found
 *       500:
 *         description: Server error
 */
router.get('/getPostTagById/:id', postTagController.getPostTagById);

/**
 * @swagger
 * /updatePostTag/{id}:
 *   put:
 *     summary: Update an existing post tag by ID
 *     tags: [PostTag]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the post tag to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the post tag
 *     responses:
 *       200:
 *         description: Post tag updated successfully
 *       400:
 *         description: Bad request (e.g., invalid input)
 *       404:
 *         description: Post tag not found
 *       500:
 *         description: Server error
 */
router.put('/updatePostTag/:id', postTagController.updatePostTag);

/**
 * @swagger
 * /deletePostTag/{id}:
 *   delete:
 *     summary: Delete a post tag by ID
 *     tags: [PostTag]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the post tag to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Post tag deleted successfully
 *       404:
 *         description: Post tag not found
 *       500:
 *         description: Server error
 */
router.delete('/deletePostTag/:id', postTagController.deletePostTag);


//FeedBack Route
/**
 * @swagger
 * /createFeedback:
 *   post:
 *     summary: Create a new feedback
 *     tags: [Feedback]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user providing feedback
 *               comment:
 *                 type: string
 *                 description: Feedback comment
 *               rating:
 *                 type: integer
 *                 description: Rating provided by the user (1-5)
 *     responses:
 *       201:
 *         description: Feedback created successfully
 *       400:
 *         description: Bad request (e.g., invalid input)
 *       500:
 *         description: Server error
 */
router.post('/createFeedback', feedbackController.createFeedback);

/**
 * @swagger
 * /getFeedbacks:
 *   get:
 *     summary: Retrieve all feedbacks
 *     tags: [Feedback]
 *     responses:
 *       200:
 *         description: A list of feedbacks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   comment:
 *                     type: string
 *                   rating:
 *                     type: integer
 *       500:
 *         description: Server error
 */
router.get('/getFeedbacks', feedbackController.getFeedbacks);

/**
 * @swagger
 * /getFeedbackById/{id}:
 *   get:
 *     summary: Retrieve a specific feedback by ID
 *     tags: [Feedback]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the feedback to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Feedback retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 comment:
 *                   type: string
 *                 rating:
 *                   type: integer
 *       404:
 *         description: Feedback not found
 *       500:
 *         description: Server error
 */
router.get('/getFeedbackById/:id', feedbackController.getFeedbackById);

/**
 * @swagger
 * /updateFeedback/{id}:
 *   put:
 *     summary: Update an existing feedback by ID
 *     tags: [Feedback]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the feedback to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 description: Updated feedback comment
 *               rating:
 *                 type: integer
 *                 description: Updated rating (1-5)
 *     responses:
 *       200:
 *         description: Feedback updated successfully
 *       400:
 *         description: Bad request (e.g., invalid input)
 *       404:
 *         description: Feedback not found
 *       500:
 *         description: Server error
 */
router.put('/updateFeedback/:id', feedbackController.updateFeedback);

/**
 * @swagger
 * /deleteFeedback/{id}:
 *   delete:
 *     summary: Delete a feedback by ID
 *     tags: [Feedback]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the feedback to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Feedback deleted successfully
 *       404:
 *         description: Feedback not found
 *       500:
 *         description: Server error
 */
router.delete('/deleteFeedback/:id', feedbackController.deleteFeedback);


//vemue review Route
/**
 * @swagger
 * /createReview:
 *   post:
 *     summary: Create a new venue review
 *     tags: [Venue Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               venueId:
 *                 type: string
 *                 description: ID of the venue being reviewed
 *               rating:
 *                 type: integer
 *                 description: Rating given by the user (1-5)
 *               comment:
 *                 type: string
 *                 description: Review comment
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: Bad request (e.g., invalid input)
 *       500:
 *         description: Server error
 */
router.post('/createReview', venuereview_controller.createReview);

/**
 * @swagger
 * /getReviews/{venueId}:
 *   get:
 *     summary: Get all reviews for a specific venue
 *     tags: [Venue Reviews]
 *     parameters:
 *       - name: venueId
 *         in: path
 *         required: true
 *         description: ID of the venue to get reviews for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of reviews for the venue
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   venueId:
 *                     type: string
 *                   rating:
 *                     type: integer
 *                   comment:
 *                     type: string
 *       404:
 *         description: Venue not found
 *       500:
 *         description: Server error
 */
router.get('/getReviews/:venueId', venuereview_controller.getReviews);

/**
 * @swagger
 * /updateReview/{id}:
 *   put:
 *     summary: Update an existing review by ID
 *     tags: [Venue Reviews]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the review to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 description: Updated rating (1-5)
 *               comment:
 *                 type: string
 *                 description: Updated review comment
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       400:
 *         description: Bad request (e.g., invalid input)
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server error
 */
router.put('/updateReview/:id', venuereview_controller.updateReview);

/**
 * @swagger
 * /deleteReview/{id}:
 *   delete:
 *     summary: Delete a review by ID
 *     tags: [Venue Reviews]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the review to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Review deleted successfully
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server error
 */
router.delete('/deleteReview/:id', venuereview_controller.deleteReview);

//Template Routes 
/**
 * @swagger
 * /createTemplate:
 *   post:
 *     summary: Create a new template
 *     tags: [Templates]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the template
 *               content:
 *                 type: string
 *                 description: Template content
 *     responses:
 *       201:
 *         description: Template created successfully
 *       400:
 *         description: Bad request (e.g., invalid input)
 *       500:
 *         description: Server error
 */
router.post('/createTemplate', templateController.createTemplate);

/**
 * @swagger
 * /getAllTemplates:
 *   get:
 *     summary: Retrieve all templates
 *     tags: [Templates]
 *     responses:
 *       200:
 *         description: A list of templates
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   content:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get('/getAllTemplates', templateController.getAllTemplates);

/**
 * @swagger
 * /getTemplateById/{id}:
 *   get:
 *     summary: Retrieve a specific template by ID
 *     tags: [Templates]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the template to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Template retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 content:
 *                   type: string
 *       404:
 *         description: Template not found
 *       500:
 *         description: Server error
 */
router.get('/getTemplateById/:id', templateController.getTemplateById);

/**
 * @swagger
 * /updateTemplateById/{id}:
 *   put:
 *     summary: Update an existing template by ID
 *     tags: [Templates]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the template to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the template
 *               content:
 *                 type: string
 *                 description: Updated content of the template
 *     responses:
 *       200:
 *         description: Template updated successfully
 *       400:
 *         description: Bad request (e.g., invalid input)
 *       404:
 *         description: Template not found
 *       500:
 *         description: Server error
 */
router.put('/updateTemplateById/:id', templateController.updateTemplateById);

/**
 * @swagger
 * /deleteTemplateById/{id}:
 *   delete:
 *     summary: Delete a template by ID
 *     tags: [Templates]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the template to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Template deleted successfully
 *       404:
 *         description: Template not found
 *       500:
 *         description: Server error
 */
router.delete('/deleteTemplateById/:id', templateController.deleteTemplateById);
router.put('/updateTemplateStatus/:id', templateController.updateTemplateStatus);






//FAQ Routes
/**
 * @swagger
 * /addFAQ:
 *   post:
 *     summary: Add a new FAQ
 *     tags: [FAQs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *                 description: The question of the FAQ
 *               answer:
 *                 type: string
 *                 description: The answer to the FAQ
 *     responses:
 *       201:
 *         description: FAQ created successfully
 *       400:
 *         description: Bad request (e.g., invalid input)
 *       500:
 *         description: Server error
 */
router.post('/addFAQ', faqController.addFAQ);

/**
 * @swagger
 * /getAllFAQs:
 *   get:
 *     summary: Retrieve all FAQs
 *     tags: [FAQs]
 *     responses:
 *       200:
 *         description: A list of FAQs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   question:
 *                     type: string
 *                   answer:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get('/getAllFAQs', faqController.getAllFAQs);

/**
 * @swagger
 * /getFAQById/{id}:
 *   get:
 *     summary: Retrieve a specific FAQ by ID
 *     tags: [FAQs]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the FAQ to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: FAQ retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 question:
 *                   type: string
 *                 answer:
 *                   type: string
 *       404:
 *         description: FAQ not found
 *       500:
 *         description: Server error
 */
router.get('/getFAQById/:id', faqController.getFAQById);

/**
 * @swagger
 * /updateFAQ/{id}:
 *   put:
 *     summary: Update an existing FAQ by ID
 *     tags: [FAQs]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the FAQ to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *                 description: The updated question of the FAQ
 *               answer:
 *                 type: string
 *                 description: The updated answer to the FAQ
 *     responses:
 *       200:
 *         description: FAQ updated successfully
 *       400:
 *         description: Bad request (e.g., invalid input)
 *       404:
 *         description: FAQ not found
 *       500:
 *         description: Server error
 */
router.put('/updateFAQ/:id', faqController.updateFAQ);

/**
 * @swagger
 * /deleteFAQ/{id}:
 *   delete:
 *     summary: Delete a specific FAQ by ID
 *     tags: [FAQs]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the FAQ to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: FAQ deleted successfully
 *       404:
 *         description: FAQ not found
 *       500:
 *         description: Server error
 */
router.delete('/deleteFAQ/:id', faqController.deleteFAQ);


// request to add user in group routes
/**
 * @swagger
 * /addUserToGroup:
 *   post:
 *     summary: Add a user to a group
 *     tags: [User Groups]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user to add
 *               groupId:
 *                 type: string
 *                 description: ID of the group to which the user will be added
 *     responses:
 *       201:
 *         description: User added to group successfully
 *       400:
 *         description: Bad request (e.g., invalid input)
 *       500:
 *         description: Server error
 */
router.post('/addUserToGroup', addUserToGroup);

/**
 * @swagger
 * /pendingRequests/{userId}:
 *   get:
 *     summary: Retrieve pending requests for a user
 *     tags: [User Groups]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID of the user to retrieve pending requests for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of pending requests for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   requestId:
 *                     type: string
 *                   groupId:
 *                     type: string
 *                   status:
 *                     type: string
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/pendingRequests/:userId', getPendingRequestsByUserId);

/**
 * @swagger
 * /updateUserStatus:
 *   put:
 *     summary: Update the status of a user in a group
 *     tags: [User Groups]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user whose status will be updated
 *               groupId:
 *                 type: string
 *                 description: ID of the group where the user status will be updated
 *               status:
 *                 type: string
 *                 description: New status of the user (e.g., 'active', 'inactive')
 *     responses:
 *       200:
 *         description: User status updated successfully
 *       400:
 *         description: Bad request (e.g., invalid input)
 *       404:
 *         description: User or group not found
 *       500:
 *         description: Server error
 */
router.put('/updateUserStatus', updateUserStatus);





//Booking request routes 
/**
 * @swagger
 * /createBookingRequest:
 *   post:
 *     summary: Create a new booking request
 *     tags: [Booking Requests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user making the booking request
 *               bookingDate:
 *                 type: string
 *                 format: date-time
 *                 description: Date and time of the booking
 *               details:
 *                 type: string
 *                 description: Additional details for the booking request
 *     responses:
 *       201:
 *         description: Booking request created successfully
 *       400:
 *         description: Bad request (e.g., invalid input)
 *       500:
 *         description: Server error
 */
router.post('/createBookingRequest', bookingRequestController.createBookingRequest);

/**
 * @swagger
 * /getAllBookingRequests:
 *   get:
 *     summary: Retrieve all booking requests
 *     tags: [Booking Requests]
 *     responses:
 *       200:
 *         description: List of all booking requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   bookingDate:
 *                     type: string
 *                     format: date-time
 *                   details:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get('/getAllBookingRequests', bookingRequestController.getAllBookingRequests);

/**
 * @swagger
 * /getBookingRequestById/{id}:
 *   get:
 *     summary: Retrieve a booking request by ID
 *     tags: [Booking Requests]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the booking request to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking request retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 bookingDate:
 *                   type: string
 *                   format: date-time
 *                 details:
 *                   type: string
 *       404:
 *         description: Booking request not found
 *       500:
 *         description: Server error
 */
router.get('/getBookingRequestById/:id', bookingRequestController.getBookingRequestById);

/**
 * @swagger
 * /updateBookingRequestById/{id}:
 *   put:
 *     summary: Update a booking request by ID
 *     tags: [Booking Requests]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the booking request to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookingDate:
 *                 type: string
 *                 format: date-time
 *                 description: Updated date and time of the booking
 *               details:
 *                 type: string
 *                 description: Updated details for the booking request
 *     responses:
 *       200:
 *         description: Booking request updated successfully
 *       404:
 *         description: Booking request not found
 *       500:
 *         description: Server error
 */
router.put('/updateBookingRequestById/:id', bookingRequestController.updateBookingRequestById);

/**
 * @swagger
 * /deleteBookingRequestById/{id}:
 *   delete:
 *     summary: Delete a booking request by ID
 *     tags: [Booking Requests]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the booking request to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking request deleted successfully
 *       404:
 *         description: Booking request not found
 *       500:
 *         description: Server error
 */
router.delete('/deleteBookingRequestById/:id', bookingRequestController.deleteBookingRequestById);




// Create a new Type
/**
 * @swagger
 * /createVenueType:
 *   post:
 *     summary: Create a new venue type
 *     tags: [Venue Types]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the venue type
 *               description:
 *                 type: string
 *                 description: Description of the venue type
 *     responses:
 *       201:
 *         description: Venue type created successfully
 *       400:
 *         description: Bad request (e.g., invalid input)
 *       500:
 *         description: Server error
 */
router.post('/createVenueType', venueTypeController.createVenueType);

/**
 * @swagger
 * /getAllVenueTypes:
 *   get:
 *     summary: Retrieve all venue types
 *     tags: [Venue Types]
 *     responses:
 *       200:
 *         description: List of all venue types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get('/getAllVenueTypes', venueTypeController.getAllVenueTypes);

/**
 * @swagger
 * /getVenueTypeById/{id}:
 *   get:
 *     summary: Retrieve a venue type by ID
 *     tags: [Venue Types]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the venue type to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Venue type retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *       404:
 *         description: Venue type not found
 *       500:
 *         description: Server error
 */
router.get('/getVenueTypeById/:id', venueTypeController.getVenueTypeById);

/**
 * @swagger
 * /updateVenueTypeById/{id}:
 *   put:
 *     summary: Update a venue type by ID
 *     tags: [Venue Types]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the venue type to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the venue type
 *               description:
 *                 type: string
 *                 description: Updated description of the venue type
 *     responses:
 *       200:
 *         description: Venue type updated successfully
 *       404:
 *         description: Venue type not found
 *       500:
 *         description: Server error
 */
router.put('/updateVenueTypeById/:id', venueTypeController.updateVenueTypeById);

/**
 * @swagger
 * /deleteVenueTypeById/{id}:
 *   delete:
 *     summary: Delete a venue type by ID
 *     tags: [Venue Types]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the venue type to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Venue type deleted successfully
 *       404:
 *         description: Venue type not found
 *       500:
 *         description: Server error
 */
router.delete('/deleteVenueTypeById/:id', venueTypeController.deleteVenueTypeById);




//Share Post Routes 
/**
 * @swagger
 * /createPostShare:
 *   post:
 *     summary: Create a new post share
 *     tags: [Post Shares]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *                 description: ID of the post to be shared
 *               userId:
 *                 type: string
 *                 description: ID of the user sharing the post
 *               shareDate:
 *                 type: string
 *                 format: date-time
 *                 description: Date and time when the post was shared
 *     responses:
 *       201:
 *         description: Post share created successfully
 *       400:
 *         description: Bad request (e.g., invalid input)
 *       500:
 *         description: Server error
 */
router.post('/createPostShare', postShareController.createPostShare);

/**
 * @swagger
 * /getPostShares:
 *   get:
 *     summary: Retrieve all post shares
 *     tags: [Post Shares]
 *     responses:
 *       200:
 *         description: List of all post shares
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   postId:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   shareDate:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Server error
 */
router.get('/getPostShares', postShareController.getPostShares);

/**
 * @swagger
 * /getPostShareById/{id}:
 *   get:
 *     summary: Retrieve a post share by ID
 *     tags: [Post Shares]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the post share to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post share retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 postId:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 shareDate:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Post share not found
 *       500:
 *         description: Server error
 */
router.get('/getPostShareById/:id', postShareController.getPostShareById);

/**
 * @swagger
 * /updatePostShare/{id}:
 *   put:
 *     summary: Update a post share by ID
 *     tags: [Post Shares]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the post share to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *                 description: New ID of the post to be shared
 *               userId:
 *                 type: string
 *                 description: New ID of the user sharing the post
 *               shareDate:
 *                 type: string
 *                 format: date-time
 *                 description: New date and time when the post was shared
 *     responses:
 *       200:
 *         description: Post share updated successfully
 *       404:
 *         description: Post share not found
 *       500:
 *         description: Server error
 */
router.put('/updatePostShare/:id', postShareController.updatePostShare);

/**
 * @swagger
 * /deletePostShare/{id}:
 *   delete:
 *     summary: Delete a post share by ID
 *     tags: [Post Shares]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the post share to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post share deleted successfully
 *       404:
 *         description: Post share not found
 *       500:
 *         description: Server error
 */
router.delete('/deletePostShare/:id', postShareController.deletePostShare);


//kitty detail routes 
/**
 * @swagger
 * /createKittyDetail:
 *   post:
 *     summary: Create a new kitty detail
 *     tags: [Kitties]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the kitty
 *               description:
 *                 type: string
 *                 description: Description of the kitty
 *               age:
 *                 type: integer
 *                 description: Age of the kitty
 *               breed:
 *                 type: string
 *                 description: Breed of the kitty
 *               owner:
 *                 type: string
 *                 description: Owner of the kitty
 *     responses:
 *       201:
 *         description: Kitty detail created successfully
 *       400:
 *         description: Bad request (e.g., invalid input)
 *       500:
 *         description: Server error
 */
router.post('/createKittyDetail', kittyDetailControllers.createKittyDetail);

/**
 * @swagger
 * /getAllKittyDetails:
 *   get:
 *     summary: Retrieve all kitty details
 *     tags: [Kitties]
 *     responses:
 *       200:
 *         description: List of all kitty details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   age:
 *                     type: integer
 *                   breed:
 *                     type: string
 *                   owner:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get('/getAllKittyDetails', kittyDetailControllers.getAllKittyDetails);

/**
 * @swagger
 * /getKittyDetailById/{id}:
 *   get:
 *     summary: Retrieve a kitty detail by ID
 *     tags: [Kitties]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the kitty detail to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Kitty detail retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 age:
 *                   type: integer
 *                 breed:
 *                   type: string
 *                 owner:
 *                   type: string
 *       404:
 *         description: Kitty detail not found
 *       500:
 *         description: Server error
 */
router.get('/getKittyDetailById/:id', kittyDetailControllers.getKittyDetailById);

/**
 * @swagger
 * /updateKittyDetail/{id}:
 *   put:
 *     summary: Update a kitty detail by ID
 *     tags: [Kitties]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the kitty detail to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: New name of the kitty
 *               description:
 *                 type: string
 *                 description: New description of the kitty
 *               age:
 *                 type: integer
 *                 description: New age of the kitty
 *               breed:
 *                 type: string
 *                 description: New breed of the kitty
 *               owner:
 *                 type: string
 *                 description: New owner of the kitty
 *     responses:
 *       200:
 *         description: Kitty detail updated successfully
 *       404:
 *         description: Kitty detail not found
 *       500:
 *         description: Server error
 */
router.put('/updateKittyDetail/:id', kittyDetailControllers.updateKittyDetail);

/**
 * @swagger
 * /deleteKittyDetail/{id}:
 *   delete:
 *     summary: Delete a kitty detail by ID
 *     tags: [Kitties]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the kitty detail to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Kitty detail deleted successfully
 *       404:
 *         description: Kitty detail not found
 *       500:
 *         description: Server error
 */
router.delete('/deleteKittyDetail/:id', kittyDetailControllers.deleteKittyDetail);

/**
 * @swagger
 * /rateKitty:
 *   post:
 *     summary: Rate a kitty
 *     tags: [Kitties]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               kittyId:
 *                 type: string
 *                 description: ID of the kitty to rate
 *               rating:
 *                 type: integer
 *                 description: Rating for the kitty (e.g., 1-5)
 *     responses:
 *       201:
 *         description: Kitty rated successfully
 *       400:
 *         description: Bad request (e.g., invalid input)
 *       404:
 *         description: Kitty not found
 *       500:
 *         description: Server error
 */
router.post('/rateKitty', kittyDetailControllers.rateKitty);



// Route to get all past kitties
/**
 * @swagger
 * /getPastKitties:
 *   get:
 *     summary: Retrieve all past kitties
 *     tags: [Kitties]
 *     responses:
 *       200:
 *         description: List of all past kitties
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Server error
 */
router.get('/getPastKitties', kittyDetailControllers.getPastKitties);

/**
 * @swagger
 * /getUpcomingKittyCountdown:
 *   get:
 *     summary: Get the countdown for upcoming kitties
 *     tags: [Kitties]
 *     responses:
 *       200:
 *         description: Countdown for upcoming kitties
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 countdown:
 *                   type: string
 *                   description: Countdown time until the next kitty event
 *       500:
 *         description: Server error
 */
router.get('/getUpcomingKittyCountdown', kittyDetailControllers.getUpcomingKittyCountdown);

/**
 * @swagger
 * /getFutureKitties:
 *   get:
 *     summary: Retrieve all future kitties
 *     tags: [Kitties]
 *     responses:
 *       200:
 *         description: List of all future kitties
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Server error
 */
router.get('/getFutureKitties', kittyDetailControllers.getFutureKitties);



//past fun routes
/**
 * @swagger
 * /createPastFun:
 *   post:
 *     summary: Create a new Past Fun entry
 *     tags: [Past Fun]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the Past Fun entry
 *               description:
 *                 type: string
 *                 description: Description of the Past Fun entry
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Date of the Past Fun entry
 *     responses:
 *       201:
 *         description: Past Fun entry created successfully
 *       400:
 *         description: Bad request (e.g., invalid input)
 *       500:
 *         description: Server error
 */
router.post('/createPastFun', pastFunController.createPastFun);

/**
 * @swagger
 * /getAllPastFun:
 *   get:
 *     summary: Retrieve all Past Fun entries
 *     tags: [Past Fun]
 *     responses:
 *       200:
 *         description: List of all Past Fun entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Server error
 */
router.get('/getAllPastFun', pastFunController.getAllPastFun);

/**
 * @swagger
 * /getPastFunById/{id}:
 *   get:
 *     summary: Retrieve a Past Fun entry by ID
 *     tags: [Past Fun]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the Past Fun entry to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Past Fun entry retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Entry not found
 *       500:
 *         description: Server error
 */
router.get('/getPastFunById/:id', pastFunController.getPastFunById);

/**
 * @swagger
 * /updatePastFunById/{id}:
 *   put:
 *     summary: Update a Past Fun entry by ID
 *     tags: [Past Fun]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the Past Fun entry to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: New title of the Past Fun entry
 *               description:
 *                 type: string
 *                 description: New description of the Past Fun entry
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: New date of the Past Fun entry
 *     responses:
 *       200:
 *         description: Past Fun entry updated successfully
 *       404:
 *         description: Entry not found
 *       500:
 *         description: Server error
 */
router.put('/updatePastFunById/:id', pastFunController.updatePastFunById);

/**
 * @swagger
 * /deletePastFunById/{id}:
 *   delete:
 *     summary: Delete a Past Fun entry by ID
 *     tags: [Past Fun]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the Past Fun entry to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Past Fun entry deleted successfully
 *       404:
 *         description: Entry not found
 *       500:
 *         description: Server error
 */
router.delete('/deletePastFunById/:id', pastFunController.deletePastFunById);

// Create a new Terms and Services document
/**
 * @swagger
 * /createTermsAndServices:
 *   post:
 *     summary: Create a new Terms and Services document
 *     tags: [Terms and Services]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the Terms and Services document
 *               content:
 *                 type: string
 *                 description: Content of the Terms and Services document
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Terms and Services document created successfully
 *       400:
 *         description: Bad request (e.g., invalid input)
 *       500:
 *         description: Server error
 */
router.post('/createTermsAndServices', createTermsAndServices);

/**
 * @swagger
 * /getTermsAndServices:
 *   get:
 *     summary: Get all Terms and Services documents
 *     tags: [Terms and Services]
 *     responses:
 *       200:
 *         description: List of all Terms and Services documents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   content:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Server error
 */
router.get('/getTermsAndServices', getTermsAndServices);

/**
 * @swagger
 * /getTermsAndServices/{id}:
 *   get:
 *     summary: Get a single Terms and Services document by ID
 *     tags: [Terms and Services]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the Terms and Services document to fetch
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Terms and Services document retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Document not found
 *       500:
 *         description: Server error
 */
router.get('/getTermsAndServices/:id', getTermsAndServicesById);

/**
 * @swagger
 * /updateTermsAndServices/{id}:
 *   put:
 *     summary: Update a Terms and Services document by ID
 *     tags: [Terms and Services]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the Terms and Services document to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: New title of the Terms and Services document
 *               content:
 *                 type: string
 *                 description: New content of the Terms and Services document
 *     responses:
 *       200:
 *         description: Terms and Services document updated successfully
 *       404:
 *         description: Document not found
 *       500:
 *         description: Server error
 */
router.put('/updateTermsAndServices/:id', updateTermsAndServices);

/**
 * @swagger
 * /deleteTermsAndServices/{id}:
 *   delete:
 *     summary: Delete a Terms and Services document by ID
 *     tags: [Terms and Services]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the Terms and Services document to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Terms and Services document deleted successfully
 *       404:
 *         description: Document not found
 *       500:
 *         description: Server error
 */
router.delete('/deleteTermsAndServices/:id', deleteTermsAndServices);


//wallet 
/**
 * @swagger
 * /walletTransactions:
 *   post:
 *     summary: Create a new wallet transaction
 *     tags: [Wallet Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [credit, debit]
 *               description:
 *                 type: string
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Wallet transaction created successfully
 *       400:
 *         description: Bad request (e.g., invalid input)
 *       500:
 *         description: Server error
 */
router.post('/walletTransactions', walletTransactionControllers.createWalletTransaction);

/**
 * @swagger
 * /walletTransactions:
 *   get:
 *     summary: Get all wallet transactions
 *     tags: [Wallet Transactions]
 *     responses:
 *       200:
 *         description: List of all wallet transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   amount:
 *                     type: number
 *                   type:
 *                     type: string
 *                   description:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Server error
 */
router.get('/walletTransactions', walletTransactionControllers.getAllWalletTransactions);

/**
 * @swagger
 * /walletTransactions/user/{userId}:
 *   get:
 *     summary: Get wallet transactions by user ID
 *     tags: [Wallet Transactions]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID of the user to fetch transactions for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of wallet transactions for the specified user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   amount:
 *                     type: number
 *                   type:
 *                     type: string
 *                   description:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: User not found or no transactions found
 *       500:
 *         description: Server error
 */
router.get('/walletTransactions/user/:userId', walletTransactionControllers.getWalletTransactionsByUserId);

/**
 * @swagger
 * /walletTransactions/{id}:
 *   put:
 *     summary: Update a wallet transaction by ID
 *     tags: [Wallet Transactions]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the transaction to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [credit, debit]
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Wallet transaction updated successfully
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Server error
 */
router.put('/walletTransactions/:id', walletTransactionControllers.updateWalletTransaction);

/**
 * @swagger
 * /walletTransactions/{id}:
 *   delete:
 *     summary: Delete a wallet transaction by ID
 *     tags: [Wallet Transactions]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the transaction to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Wallet transaction deleted successfully
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Server error
 */
router.delete('/walletTransactions/:id', walletTransactionControllers.deleteWalletTransaction);

//Routes to Upload Images On S3Bucket
/**
 * @swagger
 * /uploadKittyBanner:
 *   post:
 *     summary: Upload a kitty banner image to S3
 *     tags: [Image Uploads]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The kitty banner image file to upload
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 imageUrl:
 *                   type: string
 *       400:
 *         description: Bad request (e.g., file not provided)
 *       500:
 *         description: Server error
 */
router.post('/uploadKittyBanner', uploadImageController.uploadKittyBanner);

// Route to add a draft
/**
 * @swagger
 * /addtodraft:
 *   post:
 *     summary: Add a new draft
 *     tags: [Drafts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               content:
 *                 type: string
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Draft added successfully
 *       500:
 *         description: Server error
 */
router.post('/addtodraft', draftController.addToDraft);

/**
 * @swagger
 * /getdraftbyuserid/{userId}:
 *   get:
 *     summary: Get drafts by user ID
 *     tags: [Drafts]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID of the user to fetch drafts for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of drafts for the specified user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   content:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: User not found or no drafts found
 *       500:
 *         description: Server error
 */
router.get('/getdraftbyuserid/:userId', draftController.getDraftByUserId);

/**
 * @swagger
 * /getalldrafts:
 *   get:
 *     summary: Get all drafts
 *     tags: [Drafts]
 *     responses:
 *       200:
 *         description: List of all drafts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   content:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Server error
 */
router.get('/getalldrafts', draftController.getAllDrafts);




// poll routes 
/**
 * @swagger
 * /polls:
 *   post:
 *     summary: Create a new poll
 *     tags: [Polls]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Poll created successfully
 *       500:
 *         description: Server error
 */
router.post('/polls', pollController.createPoll);

/**
 * @swagger
 * /polls:
 *   get:
 *     summary: Get all polls
 *     tags: [Polls]
 *     responses:
 *       200:
 *         description: List of all polls
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   question:
 *                     type: string
 *                   options:
 *                     type: array
 *                     items:
 *                       type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Server error
 */
router.get('/polls', pollController.getAllPolls);

/**
 * @swagger
 * /polls/{id}:
 *   get:
 *     summary: Get a poll by ID
 *     tags: [Polls]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the poll to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Poll details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 question:
 *                   type: string
 *                 options:
 *                   type: array
 *                   items:
 *                     type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Poll not found
 *       500:
 *         description: Server error
 */
router.get('/polls/:id', pollController.getPollById);

/**
 * @swagger
 * /polls/{id}:
 *   put:
 *     summary: Update a poll by ID
 *     tags: [Polls]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the poll to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Poll updated successfully
 *       404:
 *         description: Poll not found
 *       500:
 *         description: Server error
 */
router.put('/polls/:id', pollController.updatePoll);

/**
 * @swagger
 * /polls/{id}:
 *   delete:
 *     summary: Delete a poll by ID
 *     tags: [Polls]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the poll to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Poll deleted successfully
 *       404:
 *         description: Poll not found
 *       500:
 *         description: Server error
 */
router.delete('/polls/:id', pollController.deletePoll);



//memories routes 
/**
 * @swagger
 * /addMemory:
 *   post:
 *     summary: Add a new memory
 *     tags: [Memories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               content:
 *                 type: string
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Memory added successfully
 *       500:
 *         description: Server error
 */
router.post('/addMemory', memoriesControllers.addMemory);

/**
 * @swagger
 * /getMemoriesByUserId/{userId}:
 *   get:
 *     summary: Get memories by user ID
 *     tags: [Memories]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID of the user to fetch memories for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of memories for the specified user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   content:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/getMemoriesByUserId/:userId', memoriesControllers.getMemoriesByUserId);

/**
 * @swagger
 * /updateMemory/{id}:
 *   put:
 *     summary: Update a memory
 *     tags: [Memories]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the memory to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Memory updated successfully
 *       404:
 *         description: Memory not found
 *       500:
 *         description: Server error
 */
router.put('/updateMemory/:id', memoriesControllers.updateMemory);

/**
 * @swagger
 * /deleteMemory/{id}:
 *   delete:
 *     summary: Delete a memory
 *     tags: [Memories]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the memory to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Memory deleted successfully
 *       404:
 *         description: Memory not found
 *       500:
 *         description: Server error
 */
router.delete('/deleteMemory/:id', memoriesControllers.deleteMemory);

/**
 * @swagger
 * /getAllMemories:
 *   get:
 *     summary: Get all memories
 *     tags: [Memories]
 *     responses:
 *       200:
 *         description: List of all memories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   content:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Server error
 */
router.get('/getAllMemories', memoriesControllers.getAllMemories);

//icon
/**
 * @swagger
 * /addIcon:
 *   post:
 *     summary: Add a new icon
 *     tags: [Icons]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Icon added successfully
 *       500:
 *         description: Server error
 */
router.post('/addIcon', iconControllers.addIcon);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all icons
 *     tags: [Icons]
 *     responses:
 *       200:
 *         description: List of icons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   url:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get('/', iconControllers.getAllIcons);

/**
 * @swagger
 * /update/{id}:
 *   put:
 *     summary: Update an icon
 *     tags: [Icons]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the icon to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Icon updated successfully
 *       404:
 *         description: Icon not found
 *       500:
 *         description: Server error
 */
router.put('/update/:id', iconControllers.updateIcon);

/**
 * @swagger
 * /delete/{id}:
 *   delete:
 *     summary: Delete an icon
 *     tags: [Icons]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the icon to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Icon deleted successfully
 *       404:
 *         description: Icon not found
 *       500:
 *         description: Server error
 */
router.delete('/delete/:id', iconControllers.deleteIcon);


router.get('/getUserWalletForGroup/:userId/:groupId', wallet_Controller.getUserWalletForGroup);
router.get('/getAllUsersWalletForGroup/:groupId', wallet_Controller.getAllUsersWalletForGroup);





module.exports = router;
