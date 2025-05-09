require('dotenv').config();
const Kitty = require("../../schema/kittySchema");
const Venue = require("../../schema/venueSchema");
const FcmToken = require('../../schema/FcmSchema'); // Your FCM schema
const admin = require("firebase-admin");

const VenueReviewSchema = require("../../schema/venueReviewSchema");
const NotificationSchema = require("../../schema/notificationSchema");
const UserSchema = require("../../schema/userSchema");
const GroupSchema = require("../../schema/groupSchema");
const WalletSchema = require("../../schema/walletSchema");
const moment = require("moment-timezone");
const CustomTheme = require("../../schema/customtheme");
const mongoose = require("mongoose");
const { sendPushNotifications } = require('../../PushNotification/pushNotification');
const { default: axios } = require('axios');

exports.checkLatestVersion = async (req, res) => {
  const { currentVersion } = req.body;

  if (!currentVersion) {
    return res.status(400).json({
      success: false,
      message: 'Current version is required.',
    });
  }

  const latestVersion = process.env.LATEST_VERSION;

  if (currentVersion === latestVersion) {
    return res.status(200).json({
      success: true,
      message: 'Your app is up to date.',
    });
  } else {
    return res.status(400).json({
      success: false,
      message: `A new version (${latestVersion}) is available. Please update your app.`,
      latestVersion: latestVersion

    });
  }
}

// exports.addKitty = async (req, res) => {
//   try {
//     const {
//       name,
//       groupId,
//       userId,
//       date,
//       time,
//       image,
//       themeId,
//       instructions,
//       colorId,
//       venueId,
//       activityId,
//       templateId,
//       addressId,
//       theamepoll,
//       locationpoll,
//       venuepoll,
//       planKittypoll,
//       activityKittypoll,
//       tampimage,
//     } = req.body;

//     console.log("req.body ", req.body);
    

//     // Validation checks
//     if (!name || typeof name !== "string") {
//       return res
//         .status(400)
//         .json({ error: "Name is required and must be a string" });
//     }
//     if (!groupId || !mongoose.Types.ObjectId.isValid(groupId)) {
//       return res.status(400).json({ error: "Invalid groupId" });
//     }
//     if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({ error: "Invalid userId" });
//     }

//     if (!time || typeof time !== "string") {
//       return res
//         .status(400)
//         .json({ error: "Time is required and must be a string" });
//     }
//     const group = await GroupSchema.findById(groupId).select("userIds userId name contributionAmount");

//     console.log("group ", group);

//     const members = group.userIds
//       .filter(user => user.userId.toString() !== userId.toString()) // Exclude the creator
//       .map(user => ({ userId: user.userId, status: "pending" }));

//       console.log("members1 ", members);

// if (!members.some(member => member.userId.toString() === group.userId.toString())) {
//   members.push({ userId: group.userId, status: "approved" }); 
// }

// console.log("members2 ", members);

//     const theamePollData = theamepoll
//       ? {
//           question: theamepoll.question,
//           options: theamepoll.options.map((option) => ({
//             optionText: option.optionText,
//             votes: option.votes || 0, //  Default to 0 if not provided
//           })),
//           type: "theampolls",
//         }
//       : null;

//     const locationPollData = locationpoll
//       ? {
//           question: locationpoll.question,
//           options: locationpoll.options.map((option) => ({
//             optionText: option.optionText,
//             votes: option.votes || 0,
//           })),
//           type: "locationpolls",
//         }
//       : null;

//     const venuePollData = venuepoll
//       ? {
//           question: venuepoll.question,
//           options: venuepoll.options.map((option) => ({
//             optionText: option.optionText,
//             votes: option.votes || 0,
//           })),
//           type: "venuepolls",
//         }
//       : null;

//     const planKittyPollData = planKittypoll
//       ? {
//           question: planKittypoll.question,
//           options: planKittypoll.options.map((option) => ({
//             optionText: option.optionText,
//             votes: option.votes || 0,
//           })),
//           type: "planKittypolls",
//         }
//       : null;

//     const activityKittyPollData = activityKittypoll
//       ? {
//           question: activityKittypoll.question,
//           options: activityKittypoll.options.map((option) => ({
//             optionText: option.optionText,
//             votes: option.votes || 0,
//           })),
//           type: "activityKittypolls",
//         }
//       : null;

//     // Create new Kitty with poll data
//     const newKitty = new Kitty({
//       name,
//       groupId,
//       userId,
//       date,
//       time,
//       image,
//       themeId,
//       instructions,
//       colorId,
//       venueId,
//       activityId,
//       templateId,
//       addressId,
//       theamepoll: theamePollData,
//       locationpoll: locationPollData,
//       venuepoll: venuePollData,
//       planKittypoll: planKittyPollData,
//       activityKittypoll: activityKittyPollData,
//       members,
//       tampimage,
//     });

//     // Save the new Kitty to the database
//     await newKitty.save();

//     // Notification work: Only one notification for all users
//     if (!group) {
//       return res.status(404).json({ error: "Group not found" });
//     }

//     const groupNotification = {
//       groupId: groupId,
//       kittyId: newKitty._id,
//       message: `A new kitty has been created: ${newKitty.name}`,
//       type: "kitty-join-request",
//       image: tampimage,
//     };

//     console.log("groupNotification ", groupNotification);
    

//     const userNotifications = group.userIds
//       .filter((user) => user.userId.toString() !== userId.toString()) // Exclude creator
//       .map((user) => ({
//         userId: user.userId,
//         ...groupNotification,
//       }));

//     console.log("userNotifications ", userNotifications);
    
//     const isHostInUserIds = group.userIds.some(
//       (user) => user.userId.toString() === group.userId.toString()
//     );

//     console.log("isHostInUserIds ", isHostInUserIds);
    
    
//     if (!isHostInUserIds) {
//       userNotifications.push({
//         userId: group.userId,
//         ...groupNotification,
//       });
//     }
    
//     console.log("userNotifications22 ", userNotifications);

//     // Insert all notifications into the database (only one type of notification)
//     await NotificationSchema.insertMany(userNotifications);

//     const notificationsWithPush = [
//       ...group.userIds
//         .filter((user) => user.userId.toString() !== userId.toString()) // Exclude the creator
//         .map((user) => ({
//           title: 'New Kitty Created',
//           message: `A new kitty has been created in your group: ${newKitty.name}`,
//           userId: user.userId,
//           image: tampimage,
//           type: 'kitty',
//           objectId: newKitty._id,
//         })),
//     ];

//     for (const notification of notificationsWithPush) {
//       await sendPushNotifications({
//         title: notification.title,
//         message: notification.message,
//         userId: notification.userId,
//         image: tampimage, // Include the image for the notification
//         type: 'kitty',
//         objectId: newKitty._id,
//       });
//     }

//     const wallet = new WalletSchema({
//       userId: userId,
//       kittyId: newKitty._id,
//       amount: group.contributionAmount, // The amount for this particular user
//       transactionType: "Contribution", // Or dynamically set based on your needs
//       description: `Initial contribution for group ${group.name}, ${newKitty.name}`,
//     });
//     await wallet.save();

//     res
//       .status(201)
//       .json({ message: "Kitty added successfully", data: newKitty });
//   } catch (err) {
//     console.error("Error adding kitty", err);
//     res.status(500).json({ error: "Failed to add kitty" });
//   }
// };

exports.addKitty = async (req, res) => {
  try {
    const {
      name,
      groupId,
      userId,
      date,
      time,
      image,
      themeId,
      instructions,
      colorId,
      venueId,
      activityId,
      templateId,
      addressId,
      theamepoll,
      locationpoll,
      venuepoll,
      planKittypoll,
      activityKittypoll,
      tampimage,
      customTheme
    } = req.body;

    // Validation checks
    if (!name || typeof name !== "string") {
      return res
        .status(400)
        .json({ error: "Name is required and must be a string" });
    }
    if (!groupId || !mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ error: "Invalid groupId" });
    }
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    if (!time || typeof time !== "string") {
      return res
        .status(400)
        .json({ error: "Time is required and must be a string" });
    }

// to handle custom theme 
    let finalThemeId = themeId; // Default to the provided themeId
    
    if (customTheme && customTheme.name) {
      const existingTheme = await CustomTheme.findOne({
        name: customTheme.name,
        createdBy: userId,
      });

      if (existingTheme) {
        finalThemeId = existingTheme._id;
      } else {
        // Create a new custom theme with only the name
        const newTheme = new CustomTheme({
          name: customTheme.name,
          createdBy: userId, // Store the user who created the theme
          isCustom: true, // Flag it as a custom theme
        });

        await newTheme.save(); // Save the new theme
        finalThemeId = newTheme._id; // Assign the new theme ID to the kitty
      }
    }
    const group = await GroupSchema.findById(groupId).select("userIds userId name contributionAmount");


    
    // Create members array from userIds
    const members = group.userIds
    .filter(user => user.userId.toString() !== userId.toString()) // Exclude the creator
    .map(user => ({ userId: user.userId, status: "pending" }));

    // Add the admin (group.userId) to members if not already included
    if (!members.some(member => member.userId.toString() === group.userId.toString())) {
      members.push({ userId: group.userId, status: "approved" }); // Admin has a different status
    }

    // Validate and structure the poll data
    const theamePollData = theamepoll
      ? {
        question: theamepoll.question,
        options: theamepoll.options.map((option) => ({
          optionText: option.optionText,
          votes: option.votes || 0, // Default to 0 if not provided
        })),
        type: "theampolls",
      }
      : null;

    const locationPollData = locationpoll
      ? {
        question: locationpoll.question,
        options: locationpoll.options.map((option) => ({
          optionText: option.optionText,
          votes: option.votes || 0,
        })),
        type: "locationpolls",
      }
      : null;

    const venuePollData = venuepoll
      ? {
        question: venuepoll.question,
        options: venuepoll.options.map((option) => ({
          optionText: option.optionText,
          votes: option.votes || 0,
        })),
        type: "venuepolls",
      }
      : null;

    const planKittyPollData = planKittypoll
      ? {
        question: planKittypoll.question,
        options: planKittypoll.options.map((option) => ({
          optionText: option.optionText,
          votes: option.votes || 0,
        })),
        type: "planKittypolls",
      }
      : null;

    const activityKittyPollData = activityKittypoll
      ? {
        question: activityKittypoll.question,
        options: activityKittypoll.options.map((option) => ({
          optionText: option.optionText,
          votes: option.votes || 0,
        })),
        type: "activityKittypolls",
      }
      : null;

    // Create new Kitty with poll data
    const newKitty = new Kitty({
      name,
      groupId,
      userId,
      date,
      time,
      image,
      themeId: finalThemeId,
      instructions,
      colorId,
      venueId,
      activityId,
      templateId,
      addressId,
      theamepoll: theamePollData,
      locationpoll: locationPollData,
      venuepoll: venuePollData,
      planKittypoll: planKittyPollData,
      activityKittypoll: activityKittyPollData,
      members,
      tampimage

    });

    // Save the new Kitty to the database
    await newKitty.save();

    //notification work------------>>>
    // Fetch group details to get userIds
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // (kitty creator) Create notifications for host (kitty creator)
    const creatorNotification = {
      userId,
      kittyId: newKitty._id,
      message: `You have created a kitty: ${newKitty.name}`,
      type: "kitty",
      image: tampimage,
    };

    // Create notifications for all users in the group, excluding the creator
    const userNotifications = group.userIds
      .filter((user) => user.userId.toString() !== userId.toString()) // Exclude creator
      .map((user) => ({
        userId: user.userId,
        groupId: groupId,
        kittyId: newKitty._id,
        message: `A new kitty has been created in your group: ${newKitty.name}`,
        type: "kitty-join-request",
        image: tampimage,
      }));

    const allNotifications = [creatorNotification, ...userNotifications];

    // ✅ Fix: Only send admin notification if admin is not the creator
    if (group.userId.toString() !== userId.toString()) {
      const adminnotify = {
        userId: group.userId,
        kittyId: newKitty._id,
        message: `A New Kitty Is Created In Your Group: ${newKitty.name}`,
        type: "kitty-join-request",
        image: tampimage,
      };
      allNotifications.push(adminnotify);
    }    

    // Insert all notifications into the database
    await NotificationSchema.insertMany(allNotifications);

    const notificationsWithPush = [
      { title: 'Kitty Created', message: `You have created a new kitty: ${newKitty.name}`, userId, type: 'kitty' },
      ...(group.userId.toString() !== userId.toString()
      ? [
          {
            title: 'New Kitty Created',
            message: `A new kitty has been created in your group: ${newKitty.name}`,
            userId: group.userId,
            type: 'kitty-join-request',
          },
        ]
      : []),
      // Send to all other users except the creator
      ...group.userIds
        .filter(user => user.userId.toString() !== userId.toString()) 
        .map(user => ({ title: 'New Kitty Created', message: `A new kitty has been created in your group: ${newKitty.name}`, userId: user.userId, type: "kitty-join-request" }))
    ];

    // Send push notifications to all users
    for (const notification of notificationsWithPush) {
      await sendPushNotifications({
        title: notification.title,
        message: notification.message,
        userId: notification.userId,
        image: tampimage, // Include the image for the notification
        type:notification.type,
        objectId: newKitty._id
      });
    }
    const wallet = new WalletSchema({
      userId: userId,
      kittyId: newKitty._id,
      amount: group.contributionAmount, // The amount for this particular user
      transactionType: "Contribution", // Or dynamically set based on your needs
      description: `Initial contribution for group ${group.name}, ${newKitty.name}`,
    });
    await wallet.save();
    res
      .status(201)
      .json({ message: "Kitty added successfully", data: newKitty });
  } catch (err) {
    console.error("Error adding kitty", err);
    res.status(500).json({ error: "Failed to add kitty" });
  }
};

exports.updateKitty = async (req, res) => {
  try {
    const {
      name,
      groupId,
      userId,
      date,
      time,
      image,
      themeId,
      instructions,
      colorId,
      venueId,
      activityId,
      templateId,
      addressId,
      theamepoll,
      locationpoll,
      venuepoll,
      customTheme
    } = req.body;

    const { kittyId } = req.params;

    // Validate kittyId
    if (!mongoose.Types.ObjectId.isValid(kittyId)) {
      return res.status(400).json({ error: "Invalid kittyId" });
    }

    // Validation checks for the fields
    if (name && typeof name !== "string") {
      return res.status(400).json({ error: "Name must be a string" });
    }

    let updatedGroupId = groupId;
    if (groupId && mongoose.Types.ObjectId.isValid(groupId)) {
      updatedGroupId = [groupId]; // Ensure it's an array with a valid ObjectId
    }

    if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    if (time && typeof time !== "string") {
      return res.status(400).json({ error: "Time must be a string" });
    }

    let finalThemeId = themeId;

    if (customTheme && customTheme.name) {
      const existingTheme = await CustomTheme.findOne({
        name: customTheme.name,
        createdBy: userId,
      });

      if (existingTheme) {
        finalThemeId = existingTheme._id;
      } else {
        const newTheme = new CustomTheme({
          name: customTheme.name,
          createdBy: userId,
          isCustom: true,
        });

        await newTheme.save();
        finalThemeId = newTheme._id;
      }
    }


    // Validate and structure the poll data
    const theamePollData = theamepoll
      ? {
        question: theamepoll.question,
        options: theamepoll.options.map((option) => ({
          optionText: option.optionText.optionText, // Access optionText correctly
          votes: option.votes || 0, // Default to 0 if not provided
        })),
        type: "theampolls",
      }
      : undefined;

    const locationPollData = locationpoll
      ? {
        question: locationpoll.question,
        options: locationpoll.options.map((option) => ({
          optionText: option.optionText.optionText, // Access optionText correctly
          votes: option.votes || 0,
        })),
        type: "locationpolls",
      }
      : undefined;

    const venuePollData = venuepoll
      ? {
        question: venuepoll.question,
        options: venuepoll.options.map((option) => ({
          optionText: option.optionText.optionText, // Access optionText correctly
          votes: option.votes || 0,
        })),
        type: "venuepolls",
      }
      : undefined;

    // Prepare the update object
    const updatedData = {
      ...(name && { name }),
      ...(groupId && { groupId: updatedGroupId }),
      ...(userId && { userId }),
      ...(date && { date }),
      ...(time && { time }),
      ...(image && { image }),
      ...(finalThemeId && { themeId: finalThemeId }),
      ...(instructions && { instructions }),
      ...(colorId && { colorId }),
      ...(venueId && { venueId }),
      ...(activityId && { activityId }),
      ...(templateId && { templateId }),
      ...(theamepoll && { theamepoll: theamePollData }),
      ...(locationpoll && { locationpoll: locationPollData }),
      ...(venuepoll && { venuepoll: venuePollData }),
    };

    // Find and update the kitty by ID
    const updatedKitty = await Kitty.findByIdAndUpdate(kittyId, updatedData, {
      new: true,
    });

    if (!updatedKitty) {
      return res.status(404).json({ error: "Kitty not found" });
    }

    // Send success response
    res
      .status(200)
      .json({ message: "Kitty updated successfully", data: updatedKitty });
  } catch (err) {
    console.error("Error updating kitty", err);
    res.status(500).json({ error: "Failed to update kitty", msg: err });
  }
};

exports.getAllKittys = async (req, res) => {
  try {
    const getAllKitty = await Kitty.find()
      .populate({
        path: "groupId",
        populate: {
          path: "userId",
          model: "Users",
        },
      })
      .populate("userId")
      .populate("venueId")

      .sort({ createdAt: -1 });

    res
      .status(200)
      .json({ message: "Data fetched successfully", data: getAllKitty });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getKittyAttendance = async (req, res) => {
  try {
    const { userId } = req.params; // Assuming userId is passed as a route parameter

    // Find kitties where userId is either inside members array or directly in the userId field
    let kitties = await Kitty.find({
      $or: [
        { userId }, // Check if userId is the creator of the kitty (directly in the Kitty document)
        { members: { $elemMatch: { userId } } }, // Check if userId is in the members array
      ],
    });

    if (!kitties.length) {
      return res
        .status(404)
        .json({ message: "No kitties found for this user" });
    }

    let approvedCount = 0;
    let isCreatorCount = 0;

    // Loop through each kitty
    kitties.forEach((kitty) => {
      // Check if the user is the creator (outside members array)
      if (kitty.userId.toString() === userId) {
        isCreatorCount++; // Increment for the creator's kitties
      }

      // Filter members where status is 'approved'
      const approvedMembers = kitty.members.filter(
        (member) =>
          member.userId.toString() === userId && member.status === "approved"
      );

      // Increment the count of approved members
      approvedCount += approvedMembers.length;
    });

    // Total count includes both creator's kitties and approved memberships
    const totalCount = isCreatorCount + approvedCount;

    // Respond with the total count
    res.status(200).json({ counts: totalCount || 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};



// exports.AndFutureKitties = async (req, res) => {
//   try {
//     const { type, page = 1, limit = 20, userId } = req.query;
//     const now = new Date();

//     const combineDateAndTime = (dateStr, timeStr) => {
//       const [day, month, year] = dateStr.split(/[\/-]/).map(Number);
//       const [rawTime, modifier] = timeStr.split(" ");
//       let [hours, minutes] = rawTime.split(":").map(Number);

//       if (modifier === "PM" && hours !== 12) hours += 12;
//       if (modifier === "AM" && hours === 12) hours = 0;

//       return new Date(year, month - 1, day, hours, minutes);
//     };

//     const filter = userId
//       ? {
//           $or: [
//             { userId },
//             { members: { $elemMatch: { userId } } }
//           ]
//         }
//       : {};

//     const allKitties = await Kitty.find(filter)
//       .populate({
//         path: "groupId",
//         populate: { path: "userId", model: "Users" },
//       })
//       .populate("userId")
//       .populate("venueId")
//       .populate("themeId")
//       .populate("colorId")
//       .populate("addressId");

//     const filteredKitties = allKitties.filter((kitty) => {
//       const kittyDateTime = combineDateAndTime(kitty.date, kitty.time);
//       return type === "past" ? kittyDateTime < now : kittyDateTime > now;
//     });

//     const sortedKitties = filteredKitties.sort((a, b) => {
//       const aTime = combineDateAndTime(a.date, a.time);
//       const bTime = combineDateAndTime(b.date, b.time);
//       return type === "future" ? aTime - bTime : bTime - aTime;
//     });

//     const totalKitties = sortedKitties.length;
//     const totalPages = Math.ceil(totalKitties / limit);
//     const startIndex = (page - 1) * limit;
//     const paginatedKitties = sortedKitties.slice(startIndex, startIndex + parseInt(limit));

//     if (paginatedKitties.length === 0) {
//       return res.status(404).json({ message: "No kitties found for the given filters." });
//     }

//     res.status(200).json({
//       message: "Data fetched successfully",
//       data: paginatedKitties,
//       totalKitties,
//       currentPage: parseInt(page),
//       totalPages,
//     });
//   } catch (err) {
//     console.error("Error in getAllPastAndFutureKitties:", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };


exports.getAllPastAndFutureKitties = async (req, res) => {
  try {
    const now = new Date();
    // Extracting filters and pagination parameters
    const userId = req.query.userId || req.params.userId;
    const type = req.query.type; // 'past' or 'future'
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    // Helper function to combine date and time into a JS Date object
    const combineDateAndTime = (dateStr, timeStr) => {
      const [day, month, year] = dateStr.split(/[\/-]/).map(Number);
      const [rawTime, modifier] = timeStr.split(" ");
      let [hours, minutes] = rawTime.split(":").map(Number);
      if (modifier === "PM" && hours !== 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;
      return new Date(year, month - 1, day, hours, minutes);
    };
    // Construct filter to find kitties created by or joined by this user
    const filter = userId
      ? {
          $or: [
            { userId },
            { members: { $elemMatch: { userId } } }
          ]
        }
      : {};
    // Fetch all matching kitties with necessary population
    const allKitties = await Kitty.find(filter)
      .populate({
        path: "groupId",
        populate: { path: "userId", model: "Users" },
      })
      .populate("userId")
      .populate("venueId")
      .populate("themeId")
      .populate("colorId")
      .populate("addressId");
    // Filter out kitties based on date and remove ones created by this user
    const filteredKitties = allKitties.filter((kitty) => {
      const kittyDateTime = combineDateAndTime(kitty.date, kitty.time);
      const isCorrectTime =
        type === "past" ? kittyDateTime < now : kittyDateTime > now;
      // Exclude kitties where the creator's ID matches current user
      const isCreatedByCurrentUser = kitty.userId?._id?.toString() === userId;
      
      const isCurrentUserApproved = Array.isArray(kitty.members) &&
        kitty.members.some(
          (member) => member.userId == userId && member.status === "approved"
        );

      return isCorrectTime && !isCreatedByCurrentUser && !isCurrentUserApproved;
    });
    // Sort kitties based on date
    const sortedKitties = filteredKitties.sort((a, b) => {
      const aTime = combineDateAndTime(a.date, a.time);
      const bTime = combineDateAndTime(b.date, b.time);
      return type === "future" ? aTime - bTime : bTime - aTime;
    });
    // Paginate the result
    const totalKitties = sortedKitties.length;
    const totalPages = Math.ceil(totalKitties / limit);
    const startIndex = (page - 1) * limit;
    const paginatedKitties = sortedKitties.slice(startIndex, startIndex + limit);
    // If no kitties found
    if (paginatedKitties.length === 0) {
      return res.status(404).json({ message: "No kitties found for the given filters." });
    }
    // Return success response
    res.status(200).json({
      message: "Data fetched successfully",
      data: paginatedKitties,
      totalKitties,
      currentPage: page,
      totalPages,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllKittiesForUser = async (req, res) => {
  try {
    const { page = 1, limit = 20, userId, type } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!type || (type !== "past" && type !== "future")) {
      return res.status(400).json({ message: "Type must be 'past' or 'future'" });
    }

    const now = moment();

    // Fetch kitties where user is either creator or member (with limited statuses)
    const userKitties = await Kitty.find({
      $or: [
        { userId }, // user is the creator
        {
          members: {
            $elemMatch: {
              userId,
              status: { $in: ["deciding", "approved", "rejected"] }
            }
          }
        }
      ],
    })
      .populate("userId")
      .populate("groupId")
      .populate("venueId")
      .populate("themeId")
      .populate("colorId")
      .populate("addressId")
      .populate("activityId")
      .lean();

    const filteredKitties = userKitties.filter((kitty) => {
      if (!kitty.date || !kitty.time) return false;

      const kittyDateTime = moment(`${kitty.date} ${kitty.time}`, "DD/MM/YYYY hh:mm A");
      const isRightTime = type === "past"
        ? kittyDateTime.isBefore(now)
        : kittyDateTime.isAfter(now);

      const isUserCreator = kitty.userId?._id?.toString() === userId;

      const isAllowedMember = kitty.members?.some(
        (member) =>
          member.userId?.toString() === userId &&
          ["deciding", "approved", "rejected"].includes(member.status)
      );

      return isRightTime && (isUserCreator || isAllowedMember);
    });

    // Sort
    const sortedKitties = filteredKitties.sort((a, b) => {
      const dateTimeA = moment(`${a.date} ${a.time}`, "DD/MM/YYYY hh:mm A");
      const dateTimeB = moment(`${b.date} ${b.time}`, "DD/MM/YYYY hh:mm A");
      return type === "past" ? dateTimeB - dateTimeA : dateTimeA - dateTimeB;
    });

    // Pagination
    const totalKitties = sortedKitties.length;
    const totalPages = Math.ceil(totalKitties / limit);
    const startIndex = (page - 1) * limit;
    const paginatedKitties = sortedKitties.slice(startIndex, startIndex + parseInt(limit));

    if (paginatedKitties.length === 0) {
      return res.status(404).json({ message: `No ${type} kitties found for this user.` });
    }

    return res.status(200).json({
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} kitties fetched successfully`,
      data: paginatedKitties,
      totalKitties,
      currentPage: parseInt(page),
      totalPages,
    });

  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};





exports.getNearestKittyCountdown = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const now = moment.tz("Asia/Kolkata");

    const futureKitties = await Kitty.find({
      $or: [{ userId }, { "members.userId": userId, "members.status": "approved" }],
    })
      .populate("userId")
      .populate("groupId")
      .populate("venueId")
      .populate("themeId")
      .populate("colorId")
      .populate("addressId")
      .populate("activityId")
      .lean();

    const filteredKitties = futureKitties
      .filter((kitty) => {
        const kittyDateTime = moment.tz(`${kitty.date} ${kitty.time}`, "DD/MM/YYYY hh:mm A", "Asia/Kolkata");
        return kittyDateTime.isAfter(now);
      })
      .sort((a, b) => {
        const aDateTime = moment.tz(`${a.date} ${a.time}`, "DD/MM/YYYY hh:mm A", "Asia/Kolkata");
        const bDateTime = moment.tz(`${b.date} ${b.time}`, "DD/MM/YYYY hh:mm A", "Asia/Kolkata");
        return aDateTime - bDateTime;
      });

    if (filteredKitties.length === 0) {
      return res.status(404).json({ message: "No upcoming kitties found." });
    }

    let nearestKitty;
    let countdown;

    for (const kitty of filteredKitties) {
      const kittyDateTime = moment.tz(`${kitty.date} ${kitty.time}`, "DD/MM/YYYY hh:mm A", "Asia/Kolkata");
      const duration = moment.duration(kittyDateTime.diff(now));

      const days = duration.days();
      const hours = duration.hours();

      if (days > 0 || hours > 0) {
        nearestKitty = kitty;
        countdown = { days, hours };
        break;
      }
    }

    if (!nearestKitty) {
      return res.status(404).json({ message: "No valid upcoming kitty found." });
    }

    return res.status(200).json({
      message: "Nearest kitty countdown fetched successfully",
      kittyId: nearestKitty._id,
      date: nearestKitty.date,
      time: nearestKitty.time,
      countdown,
    });

  } catch (error) {
    console.error("Error fetching nearest kitty countdown:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};



// exports.getNearestKittyCountdown = async (req, res) => {
//   try {
//     const { userId } = req.query;

//     if (!userId) {
//       return res.status(400).json({ message: "User ID is required" });
//     }

//     // const now = moment();
//     let testnow = moment()
//     const now = moment.tz("Asia/Kolkata");


//     const futureKitties = await Kitty.find({
//       $or: [{ userId }, { "members.userId": userId, "members.status": "approved" }],
//     })
//       .populate("userId")
//       .populate("groupId")
//       .populate("venueId")
//       .populate("themeId")
//       .populate("colorId")
//       .populate("addressId")
//       .populate("activityId")
//       .lean();

//     const filteredKitties = futureKitties.filter((kitty) => {
//       const kittyDateTime = moment(`${kitty.date} ${kitty.time}`, "DD/MM/YYYY hh:mm A");
//       return kittyDateTime.isAfter(now);
//     });

//     if (filteredKitties.length === 0) {
//       return res.status(404).json({ message: "No upcoming kitties found." });
//     }

//     // Find nearest kitty
//     const nearestKitty = filteredKitties.reduce((nearest, current) => {
//       const nearestDateTime = moment(`${nearest.date} ${nearest.time}`, "DD/MM/YYYY hh:mm A");
//       const currentDateTime = moment(`${current.date} ${current.time}`, "DD/MM/YYYY hh:mm A");
//       return currentDateTime.isBefore(nearestDateTime) ? current : nearest;
//     });

//     const kittyDateTime = moment(`${nearestKitty.date} ${nearestKitty.time}`, "DD/MM/YYYY hh:mm A");
//     const duration = moment.duration(kittyDateTime.diff(now));

//     const countdown = {
//       days: duration.days(),
//       hours: duration.hours(),
//       minutes: duration.minutes(),
//       seconds: duration.seconds(),
//     };

//     return res.status(200).json({
//       message: "Nearest kitty countdown fetched successfully",
//       kittyId: nearestKitty._id,
//       date: nearestKitty.date,
//       time: nearestKitty.time,
//       countdown,
//     });

//   } catch (error) {
//     console.error("Error fetching nearest kitty countdown:", error);
//     return res.status(500).json({ message: "Internal server error", error: error.message });
//   }
// };

exports.getAllPastAndFutureKittiesOfGroups = async (req, res) => {
  try {
    const { type, groupId } = req.query;
    const now = new Date();
    if (!groupId) {
      return res.status(400).json({ error: 'GroupId is required' })
    }


    const combineDateAndTime = (dateStr, timeStr) => {
      const dateParts = dateStr.split(/[\/-]/).map(Number);
      const [day, month, year] =
        dateParts.length === 3 ? dateParts : [null, null, null];
      const [time, modifier] = timeStr.split(" ");


      const [hours, minutes] = time.split(":").map(Number);
      const hours24 = modifier === "PM" && hours !== 12 ? hours + 12 : hours;
      const completeDate = new Date(year, month - 1, day, hours24, minutes);

      return completeDate;
    };


    const allKitties = await Kitty.find({ groupId: groupId })
      .populate({
        path: "groupId",
        populate: {
          path: "userId",
          model: "Users",
        },
      })
      .populate("userId")
      .populate("userId")
      .populate("venueId")
      .populate("themeId")
      .populate("colorId")
      .populate("addressId");


    const filteredKitties = allKitties.filter((kitty) => {
      const kittyDateTime = combineDateAndTime(kitty.date, kitty.time);

      if (type == "past") {
        return kittyDateTime < now;
      } else if (type == "future") {
        return kittyDateTime > now;
      }
    });
    const sortedKitties = filteredKitties.sort((a, b) => {
      const dateTimeA = combineDateAndTime(a.date, a.time);
      const dateTimeB = combineDateAndTime(b.date, b.time);


      if (type === "future") {
        return dateTimeA - dateTimeB;
      } else if (type === "past") {
        return dateTimeB - dateTimeA;
      }
    });

    res
      .status(200)
      .json({ message: "Data fetched successfully", data: filteredKitties });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.getAllKittyForMe = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { name, page = 1, limit = 0 } = req.query;

    const currentTime = moment();

    const query = {};
    if (name) {
      query.name = { $regex: new RegExp(name, "i") };
    }

    let KittyData = await Kitty.find(query)
      .lean()
      .populate("venueId", "name")
      .populate("groupId", "name contributionAmount groupType")
      .populate("themeId", "name");

    const filteredKitties = KittyData.filter((kitty) => {
      const isPublicGroup = kitty.groupId.some(group => group.groupType === "public");

      const kittyDateTime = moment(
        kitty.date + " " + kitty.time,
        "DD/MM/YYYY hh:mm A"
      );
      return isPublicGroup && kittyDateTime.isAfter(currentTime);
    });

    const totalKitties = filteredKitties.length;

    const startIndex = (page - 1) * limit;
    const paginatedKitties = limit
      ? filteredKitties.slice(startIndex, startIndex + parseInt(limit))
      : filteredKitties;

    const response = paginatedKitties.map((kitty) => {
      const members = Array.isArray(kitty.members) ? kitty.members : [];

      const member = members.find(
        (member) => member.userId?.toString() === userId
      );

      let kittymemberstatus = "guest";

      // if (member) {
      //   kittymemberstatus =
      //     member.status === "approved"
      //       ? "member"
      //       : member.status === "rejected"
      //         ? "rejected"
      //         : "requested";
      // } else if (kitty.userId?.toString() === userId) {
      //   kittymemberstatus = "host";
      // } else {
      //   kittymemberstatus = "notmember";
      // }

      if (kitty.userId?.toString() === userId) {
        kittymemberstatus = "host";
      } else if (member) {
        kittymemberstatus =
          member.status === "approved"
            ? "member"
            : member.status === "rejected"
              ? "rejected"
              : "requested";
      } else {
        kittymemberstatus = "notmember";
      }
      return {
        ...kitty,
        kittymemberstatus,
      };
    });


    const totalPages = limit ? Math.ceil(totalKitties / limit) : 1;

    return res.status(200).json({
      data: response,
      meta: {
        currentPage: parseInt(page),
        totalKitties,
        totalPages,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message, message: "Internal Server Error" });
  }
};



// exports.getAllKittyForMe = async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const currentTime = moment(); // Current date and time
//     const searchName = req.query.name || ""; // Get the search query (default is empty)

//     // Fetch all kitties
//     const KittyData = await Kitty.find({
//       name: { $regex: searchName, $options: "i" }, // Case-insensitive search
//     })
//       .lean()
//       .populate("venueId", "name")
//       .populate("groupId", "name contributionAmount")
//       .populate("themeId", "name");

//     // Filter kitties by future date and time
//     const filteredKitties = KittyData.filter((kitty) => {
//       const kittyDateTime = moment(
//         kitty.date + " " + kitty.time,
//         "DD/MM/YYYY hh:mm A"
//       );
//       return kittyDateTime.isAfter(currentTime);
//     });

//     // Modify response to add kittymemberstatus for each kitty
//     const response = filteredKitties.map((kitty) => {
//       const member = kitty.members.find(
//         (member) => member.userId.toString() === userId
//       );
//       let kittymemberstatus = "guest"; // Default if not in members array

//       // Set status based on membership or if the user is the host
//       if (member) {
//         kittymemberstatus =
//           member.status === "approved"
//             ? "member"
//             : member.status === "rejected"
//             ? "rejected"
//             : "requested";
//       } else if (kitty.userId.toString() === userId) {
//         kittymemberstatus = "host";
//       } else {
//         kittymemberstatus = "notmember";
//       }

//       return {
//         ...kitty,
//         kittymemberstatus,
//       };
//     });

//     return res.status(200).json({ data: response });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ error: error.message, message: "Internal Server Error" });
//   }
// };

// exports.joinKitty = async (req, res) => {
//   try {
//     const { notificationId, kittyId, requestUserId, status } = req.body;

//     // Find the kitty by ID
//     const kitty = await Kitty.findById(kittyId);

//     if (!kitty) {
//       return res.status(404).json({ message: "Kitty not found" });
//     }

//     // Check if the user is already in the members array
//     const existingMemberIndex = kitty.members.findIndex(
//       (member) => member.userId && member.userId.toString() === requestUserId
//     );

//     if (existingMemberIndex !== -1) {
//       // User is already a member, update their status
//       kitty.members[existingMemberIndex].status = status;
//     } else {
//       // User is not a member, add them to the members array
//       const newMember = {
//         userId: requestUserId,
//         status: status, // Set the status
//       };
//       console.log(newMember,"newMembernewMembernewMember");

//       kitty.members.push(newMember); // Push the new member to the array
//     }

//     // Save the updated kitty document
//     const updatedKitty = await kitty.save();

//     const user = await UserSchema.findById(requestUserId).select("fullname");
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     let notId = new mongoose.Types.ObjectId(notificationId)
//     let updatednotification = await NotificationSchema.findOneAndUpdate(
//       { _id: notId },
//       {
//         $set: {
//           message: `You approved the join request for ${kitty?.name || "unknown"}`,
//           status: status,
//           isRead: true,
//           type: "kitty"
//         },
//       },
//       { new: true }
//     );

//     // Send a notification to the kitty admin
//     const adminNotification = new NotificationSchema({
//       userId: kitty.userId, // Notification to the group admin
//       kittyId: kittyId,
//       requestUserId: requestUserId,
//       message: `${user.fullname} has requested to join your Kitty: ${kitty.name}`,
//       type: "kitty-join-request",
//     });

//     // Save the notification
//     await adminNotification.save();
//     const fcmTokens = await FcmToken.find({ userId: kitty.userId, deviceType: 'Android', });
//     // const tokens = fcmTokens
//     // .map(tokenDoc => tokenDoc.fcmToken)
//     const tokens = fcmTokens
//       .flatMap((tokenDoc) => tokenDoc?.fcmToken) // Flatten nested arrays
//       .filter((token) => token && token.trim() !== ''); // Skip invalid or empty tokens

//     const payload = {
//       notification: {
//         title: kitty.name,
//         body: adminNotification?.message,
//         image: 'your_image_url', // Optional image URL if needed
//       },
//       data: {
//         route: 'your_route',
//         title: kitty.name,
//         body: adminNotification?.message,
//       },
//     };

//     const options = {
//       priority: "high",
//     };


//     // Send notification to each token using the send method
//     if (tokens?.length > 0) {

//       console.log(tokens, "tokenstokens");
//       const response = await Promise.allSettled(tokens.map(token =>
//         admin.messaging().send({
//           token: token,
//           notification: payload.notification,
//           data: payload.data,
//           android: {
//             priority: options.priority,
//           },
//         })
//       ));
//       console.log(response, "responseresponse");

//     }


//     return res
//       .status(200)
//       .json({ message: "Member status updated successfully", updatedKitty });
//   } catch (error) {
//     console.log("the error is", error);
//     return res.status(500).json({ error: "Something went wrong" });
//   }
// };



// exports.joinKitty = async (req, res) => {
//   try {
//     const { notificationId, kittyId, requestUserId, status } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(requestUserId) || !mongoose.Types.ObjectId.isValid(kittyId)) {
//       return res.status(400).json({ message: "Invalid userId or kittyId" });
//     }

//     // Convert requestUserId to ObjectId
//     const requestUserIdObj = new mongoose.Types.ObjectId(requestUserId);

//     // Find the kitty by ID
//     let kitty = await Kitty.findById(kittyId);
//     if (!kitty) {
//       return res.status(404).json({ message: "Kitty not found" });
//     }

//     // Ensure `members` is an array
//     if (!Array.isArray(kitty.members)) {
//       kitty.members = [];
//     }

//     console.log("Before update:", kitty.members);

//     // Find if user exists in members
//     const existingMemberIndex = kitty.members.findIndex(
//       (member) => member.userId.toString() === requestUserIdObj.toString()
//     );

//     if (existingMemberIndex !== -1) {
//       // Update existing member's status
//       kitty.members[existingMemberIndex].status = status;
//     } else {
//       // Add new member
//       kitty.members.push({ userId: requestUserIdObj, status });
//     }

//     console.log("After update:", kitty.members);

//     // Save the updated kitty document
//     await kitty.save();

//     // Fetch user details
//     const user = await UserSchema.findById(requestUserId).select("fullname");
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Convert notificationId to ObjectId
//     const notId = new mongoose.Types.ObjectId(notificationId);

//     // Update notification
//     await NotificationSchema.findOneAndUpdate(
//       { _id: notId },
//       {
//         $set: {
//           message: `You approved the join request for ${kitty?.name || "unknown"}`,
//           status: status,
//           isRead: true,
//           type: "kitty",
//         },
//       },
//       { new: true }
//     );

//     // Send a notification to the kitty admin
//     const adminNotification = new NotificationSchema({
//       userId: kitty.userId,
//       kittyId: kittyId,
//       requestUserId: requestUserId,
//       message: `${user.fullname} has requested to join your Kitty: ${kitty.name}`,
//       type: "kitty-join-request",
//     });

//     // Save the notification
//     await adminNotification.save();

//     // Get FCM tokens
//     const fcmTokens = await FcmToken.find({ userId: kitty.userId, deviceType: "Android" });

//     // Filter valid FCM tokens
//     const tokens = fcmTokens
//       .flatMap((tokenDoc) => tokenDoc?.fcmToken)
//       .filter((token) => token && token.trim() !== "");

//     // Push Notification Payload
//     const payload = {
//       notification: {
//         title: kitty.name,
//         body: adminNotification?.message,
//         image: "your_image_url", // Optional
//       },
//       data: {
//         route: "your_route",
//         title: kitty.name,
//         body: adminNotification?.message,
//       },
//     };

//     // Firebase Notification Options
//     const options = { priority: "high" };

//     // Send notifications if tokens exist
//     if (tokens.length > 0) {
//       console.log("Sending notifications to tokens:", tokens);
//       const responses = await Promise.allSettled(
//         tokens.map((token) =>
//           admin.messaging().send({
//             token: token,
//             notification: payload.notification,
//             data: payload.data,
//             android: { priority: options.priority },
//           })
//         )
//       );
//       console.log("Notification responses:", responses);
//     }

//     return res.status(200).json({ message: "Member status updated successfully", updatedKitty: kitty });
//   } catch (error) {
//     console.error("Error in joinKitty:", error);
//     return res.status(500).json({ error: "Something went wrong" });
//   }
// };

exports.joinKitty = async (req, res) => {
  try {
    const { notificationId, kittyId, requestUserId, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(requestUserId) || !mongoose.Types.ObjectId.isValid(kittyId)) {
      return res.status(400).json({ message: "Invalid userId or kittyId" });
    }

    const requestUserIdObj = new mongoose.Types.ObjectId(requestUserId);

    const kitty = await Kitty.findById(kittyId);
    if (!kitty) return res.status(404).json({ message: "Kitty not found" });

    if (!Array.isArray(kitty.members)) kitty.members = [];

    const group = await GroupSchema.findOne({
      _id: kitty.groupId || null 
    });

    if (!group) return res.status(404).json({ message: "Group not found for this kitty" });

    // 3. Check if user exists in Kitty or Group
    const isInKitty = kitty.members.some(
      (member) => member.userId.toString() === requestUserIdObj.toString()
    );

    const isInGroup = group.userIds?.some(
      (entry) => entry.userId.toString() === requestUserIdObj.toString()
    ) || group.userId.toString() === requestUserIdObj.toString();

    let notificationType = "kitty-join-request";

    // 4. If user is not in group and not in kitty, add to both
    if (!isInKitty && !isInGroup) {
      // Add to group.userIds
      group.userIds = group.userIds || [];
      group.userIds.push({
        userId: requestUserIdObj,
        status: status || "isrequesteduser"
      });
      await group.save();
      

      kitty.members.push({ userId: requestUserIdObj, status: status || "isrequesteduser" });
      await kitty.save();

      notificationType = "group-kitty-join-request";
    } else {
      // 5. If already in kitty or group, just update status in kitty
      const existingIndex = kitty.members.findIndex(
        (member) => member.userId.toString() === requestUserIdObj.toString()
      );

      if (existingIndex !== -1) {
        kitty.members[existingIndex].status = status;
      } else {
        kitty.members.push({ userId: requestUserIdObj, status });
      }

      await kitty.save();
    }

    if (notificationId) {
      await NotificationSchema.findByIdAndUpdate(notificationId, {
        message: `You approved the join request for ${kitty?.name || "unknown"}`,
        status,
        isRead: true,
        type: "kitty",
      });
    }

    const user = await UserSchema.findById(requestUserId).select("fullname");
    if (!user) return res.status(404).json({ message: "User not found" });

    const adminNotification = new NotificationSchema({
      userId: kitty.userId,
      kittyId,
      requestUserId,
      message: `${user.fullname} has requested to join your Kitty: ${kitty.name}`,
      type: notificationType,
    });

    await adminNotification.save();

    // 9. Send FCM Notification
    const fcmTokens = await FcmToken.find({ userId: kitty.userId, deviceType: "Android" });
    const tokens = fcmTokens
      .flatMap((tokenDoc) => tokenDoc?.fcmToken)
      .filter((token) => token && token.trim() !== "");

    const payload = {
      notification: {
        title: kitty.name,
        body: adminNotification.message,
        image: "your_image_url", // Optional
      },
      data: {
        route: "your_route",
        title: kitty.name,
        body: adminNotification.message,
      },
    };

    if (tokens.length > 0) {
      const responses = await Promise.allSettled(
        tokens.map((token) =>
          admin.messaging().send({
            token,
            notification: payload.notification,
            data: payload.data,
            android: { priority: "high" },
          })
        )
      );
    }

    return res.status(200).json({
      message: "Join request processed successfully",
      updatedKitty: kitty,
    });
  } catch (error) {
    console.error("Error in joinKitty:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};


// exports.acceptOrRejectRequestOfKitty = async (req, res) => {
//   try {
//     const { notificationId, status, kittyId, userId } = req.body;

//     if (!kittyId || !userId || !status || !notificationId) {
//       return res.status(400).json({
//         message: "kittyId, userId, status, and notificationId are required",
//       });
//     }

//     // Find the Kitty document
//     const findWhichKitty = await Kitty.findById(kittyId);
//     if (!findWhichKitty) {
//       return res.status(404).json({ message: "Kitty not found" });
//     }

//     // Find member index in Kitty
//     const memberIndex = findWhichKitty.members.findIndex(
//       (member) => member.userId.toString() === userId.toString()
//     );
//     if (memberIndex === -1) {
//       return res.status(404).json({ message: "Member not found in the Kitty" });
//     }

//     // Fetch Notification
//     const existingNotification = await NotificationSchema.findById(notificationId);
//     if (!existingNotification) {
//       return res.status(404).json({ message: "Notification not found" });
//     }

//     // Convert "approved" to "accepted" for notification schema
//     const notificationStatus = status === "approved" ? "accepted" : status;

//     // Avoid duplicate acceptance
//     if (
//       findWhichKitty.members[memberIndex].status === "approved" &&
//       existingNotification.status === "accepted"
//     ) {
//       return res.status(400).json({ message: "Request has already been approved" });
//     }

//     // ✅ Update kitty member status
//     findWhichKitty.members[memberIndex].status = status;
//     await findWhichKitty.save();

//     // ✅ If notification type is `group-kitty-join-request`, update group user status
//     if (existingNotification.type === "group-kitty-join-request") {
//       const group = await GroupSchema.findOne({
//         $or: [
//           { "userIds.userId": userId },
//           { userId: userId }
//         ],
//       });

//       if (group) {
//         const groupUserIndex = group.userIds.findIndex(
//           (entry) => entry.userId.toString() === userId.toString()
//         );

//         if (groupUserIndex !== -1) {
//           group.userIds[groupUserIndex].status = status;
//           await group.save();
//         }
//       }
//     }

//     // ✅ Update the original notification
//     await NotificationSchema.findByIdAndUpdate(notificationId, {
//       message: `Your request to join the Kitty: ${findWhichKitty.name} has been ${status}.`,
//       type: "kitty",
//       status: notificationStatus,
//     });

//     // ✅ New notification to user
//     const userMessage =
//       status === "approved"
//         ? `Your request to join the Kitty: ${findWhichKitty.name} has been approved.`
//         : `Your request to join the Kitty: ${findWhichKitty.name} has been rejected.`;

//     const userNotification = new NotificationSchema({
//       userId,
//       kittyId,
//       message: userMessage,
//       type: "kitty",
//       status: notificationStatus,
//     });

//     await userNotification.save();

//     // ✅ FCM Push Notification
//     const fcmTokens = await FcmToken.find({ userId, deviceType: "Android" });
//     const tokens = fcmTokens
//       .flatMap((t) => t?.fcmToken)
//       .filter((token) => token && token.trim() !== "");

//     const payload = {
//       notification: {
//         title: findWhichKitty.name,
//         body: userMessage,
//         image: "your_image_url", // Optional
//       },
//       data: {
//         route: "your_route",
//         title: findWhichKitty.name,
//         body: userMessage,
//       },
//     };

//     const options = { priority: "high" };

//     if (tokens.length > 0) {
//       await Promise.all(
//         tokens.map(async (token) => {
//           try {
//             await admin.messaging().send({
//               token,
//               notification: payload.notification,
//               data: payload.data,
//               android: { priority: options.priority },
//             });
//           } catch (error) {
//             console.error(`FCM error for token ${token}:`, error);

//             if (error.code === "messaging/registration-token-not-registered") {
//               await FcmToken.findOneAndDelete({ fcmToken: token });
//               console.log(`Removed invalid FCM token: ${token}`);
//             }
//           }
//         })
//       );
//     }

//     res.status(200).json({ message: `Request ${status}` });
//   } catch (error) {
//     console.error("Error in acceptOrRejectRequestOfKitty:", error);
//     res.status(500).json({ error: "Something went wrong" });
//   }
// };


exports.acceptOrRejectRequestOfKitty = async (req, res) => {
  try {
    const { notificationId, status, kittyId, userId } = req.body;

    console.log("➡️ Request body:", req.body);

    if (!kittyId || !userId || !status || !notificationId) {
      console.warn("⚠️ Missing required fields");
      return res.status(400).json({
        message: "kittyId, userId, status, and notificationId are required",
      });
    }

    const findWhichKitty = await Kitty.findById(kittyId);
    if (!findWhichKitty) {
      console.warn("❌ Kitty not found:", kittyId);
      return res.status(404).json({ message: "Kitty not found" });
    }

    console.log("✅ Found Kitty:", findWhichKitty.name);

    const memberIndex = findWhichKitty.members.findIndex(
      (member) => member.userId.toString() === userId.toString()
    );

    if (memberIndex === -1) {
      console.warn("❌ Member not found in Kitty");
      return res.status(404).json({ message: "Member not found in the Kitty" });
    }

    const existingNotification = await NotificationSchema.findById(notificationId);
    if (!existingNotification) {
      console.warn("❌ Notification not found:", notificationId);
      return res.status(404).json({ message: "Notification not found" });
    }

    console.log("✅ Found Notification:", existingNotification.type);

    const notificationStatus = status === "approved" ? "accepted" : status;

    if (
      findWhichKitty.members[memberIndex].status === "approved" &&
      existingNotification.status === "accepted"
    ) {
      console.warn("⚠️ Request already approved");
      return res.status(400).json({ message: "Request has already been approved" });
    }

    // ✅ Update kitty member status
    findWhichKitty.members[memberIndex].status = status;
    await findWhichKitty.save();
    console.log("🔄 Updated kitty member status to:", status);

    // ✅ Update group user status
    if (existingNotification.type === "group-kitty-join-request") {
      const group = await GroupSchema.findById(findWhichKitty.groupId?.[0]);
      if (group) {
        const groupUserIndex = group.userIds.findIndex(
          (entry) => entry.userId.toString() === userId.toString()
        );
        if (groupUserIndex !== -1) {
          group.userIds[groupUserIndex].status = status;
          await group.save();
          console.log("🔄 Updated group member status to:", status);
        } else {
          console.warn("❌ User not found in group");
        }
      } else {
        console.warn("❌ Group not found:", findWhichKitty.groupId?.[0]);
      }
      
    // ✅ Delete original notification
    await NotificationSchema.findByIdAndDelete(notificationId);
    console.log("🗑️ Deleted original notification");

    // ✅ Create user notification
    const userMessage =
      status === "approved"
        ? `Your request to join the Kitty: ${findWhichKitty.name} has been approved.`
        : `Your request to join the Kitty: ${findWhichKitty.name} has been rejected.`;

    const userNotification = new NotificationSchema({
      userId,
      kittyId,
      message: userMessage,
      type: "kitty",
      status: notificationStatus,
    });
    await userNotification.save();
    console.log("📩 User notified with message:", userMessage);

    // ✅ Send FCM notification to user
    const fcmTokens = await FcmToken.find({ userId: userId });
    const tokens = fcmTokens
      .flatMap((t) => t?.fcmToken)
      .filter((token) => token && token.trim() !== "");

    console.log("📱 FCM Tokens to send to user:", tokens);

    const payload = {
      notification: {
        title: findWhichKitty.name,
        body: userMessage,
        image: "your_image_url",
      },
      data: {
        route: "/invitation",
        title: findWhichKitty.name,
        body: userMessage,
      },
    };

    const options = { priority: "high" };

    if (tokens.length > 0) {
      await Promise.all(
        tokens.map(async (token) => {
          try {
            await admin.messaging().send({
              token,
              notification: payload.notification,
              data: payload.data,
              android: { priority: options.priority },
            });
            console.log(`📤 Sent FCM to user token: ${token}`);
          } catch (error) {
            console.error(`❌ FCM error for token ${token}:`, error);
            if (error.code === "messaging/registration-token-not-registered") {
              await FcmToken.findOneAndDelete({ fcmToken: token });
              console.log(`🧹 Removed invalid FCM token: ${token}`);
            }
          }
        })
      );
    }
    }
    const user = await UserSchema.findById(userId).select("fullname");
    console.log(user,"user")
    // ✅ Notify Kitty Creator
    if (
      existingNotification.type === "kitty-join-request" &&
      findWhichKitty.userId.toString() !== userId.toString()
    ) {
      const hostMessage = `${user.fullname} has ${notificationStatus} the Kitty: ${findWhichKitty.name}`;

      await NotificationSchema.findByIdAndDelete(notificationId);
      const hostNotification = new NotificationSchema({
        userId: findWhichKitty.userId,
        kittyId,
        message: hostMessage,
        type: "kitty",
        status: notificationStatus,
      });
      await hostNotification.save();
      console.log("📩 Host notified with message:", hostMessage);

      const hostTokens = await FcmToken.find({
        userId: findWhichKitty.userId,
      });

      const hostFcmTokens = hostTokens
        .flatMap((t) => t?.fcmToken)
        .filter((token) => token && token.trim() !== "");

      console.log("📱 Host FCM Tokens:", hostFcmTokens);

      const hostPayload = {
        notification: {
          title: findWhichKitty.name,
          body: hostMessage,
          image: "your_image_url",
        },
        data: {
          route: "/invitiation",
          title: findWhichKitty.name,
          body: hostMessage,
        },
      };

      const options = { priority: "high" };

      if (hostFcmTokens.length > 0) {
        await Promise.all(
          hostFcmTokens.map(async (token) => {
            try {
              await admin.messaging().send({
                token,
                notification: hostPayload.notification,
                data: hostPayload.data,
                android: { priority: options.priority },
              });
              console.log(`📤 Sent FCM to host token: ${token}`);
            } catch (error) {
              console.error(`❌ FCM error for host token ${token}:`, error);
              if (error.code === "messaging/registration-token-not-registered") {
                await FcmToken.findOneAndDelete({ fcmToken: token });
                console.log(`🧹 Removed invalid host FCM token: ${token}`);
              }
            }
          })
        );
      }
    }

    console.log("✅ Completed processing request.");
    res.status(200).json({ message: `Request ${status}` });
  } catch (error) {
    console.error("❌ Error in acceptOrRejectRequestOfKitty:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};





exports.addKittyMemories = async (req, res) => {
  try {
    const { kittyId, image, userId } = req.body;

    // Find the kitty by ID
    const kitty = await Kitty.findById(kittyId);

    if (!kitty) {
      return res.status(404).json({ message: "Kitty not found" });
    }
    const getGroupId = kitty?.groupId[0]?._id;

    let groupdata = await GroupSchema.find(getGroupId);

    // Add the new memory to the groupMemories array
    groupdata.groupMemories.push({
      image: image,
      userId: userId, // userId from the request body
    });

    // Save the updated group document
    await group.save();

    res.status(200).json({ message: "Memory added successfully", group });
  } catch (error) {
    res.status(500).json({ message: "Error adding memory", error });
  }
};

exports.getKittyById = async (req, res) => {
  const kittyId = req.params.id; // Capture the ID from request parameters
  const userId = req.query.userId; // Capture userId from query params

  try {
    const getKitty = await Kitty.findById(kittyId)
      .populate({
        path: "groupId",
        populate: {
          path: "userId",
          model: "Users",
        },
      })
      .populate("userId")
      .populate("members.userId")
      .populate("themeId")
      .populate("venueId")
      .populate("addressId")
      .populate("colorId")
      .populate("activityId")
      .populate("templateId");

    if (!getKitty) {
      return res.status(404).json({ error: "Kitty not found" });
    }
    if (getKitty.members) {
      getKitty.members = getKitty.members.filter((member) => member.userId !== null);
    }
    let isJoin = false;

    if (userId) {
      // Check if userId matches getKitty.userId
      if (getKitty.userId && getKitty.userId._id.toString() === userId) {
        isJoin = true;
      }

      // Check if userId exists in members array with status 'approved'
      if (
        getKitty.members &&
        getKitty.members.some(
          (member) => member.userId._id.toString() === userId && member.status === "approved"
        )
      ) {
        isJoin = true;
      }
    }

    let venueRev = await VenueReviewSchema.find({ venueId: getKitty?.venueId });
    res
      .status(200)
      .json({
        message: "Kitty fetched successfully",
        data: getKitty,
        Venuereviews: venueRev?.length || 0,
        isJoin, // Pass the isJoin flag

      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getKittyMemoriesById = async (req, res) => {
  const kittyId = req.params.id;
  const userId = req.params.userId; // Extract userId from params if provided
  const page = parseInt(req.query.page) || 0; // Default to page 0
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
  const skip = page * limit; // Calculate the number of items to skip based on the page

  try {
    const getKitty = await Kitty.findById(kittyId)
      .populate("kittyMemories.userId", "fullname profileImage") // Select the fullname field
      .lean(); // Use .lean() to get plain JavaScript objects instead of Mongoose documents

    if (!getKitty) {
      return res.status(404).json({ error: "Kitty not found" });
    }

    // Reorder memories: prioritize those uploaded by the given userId
    let orderedMemories = getKitty.kittyMemories;
    if (userId) {
      const byUser = orderedMemories.filter(
        (memory) => memory.userId?._id?.toString() === userId
      );
      const others = orderedMemories.filter(
        (memory) => memory.userId?._id?.toString() !== userId
      );
      orderedMemories = [...byUser, ...others];
    }

    // Paginate the ordered memories
    const paginatedMemories = orderedMemories.slice(skip, skip + limit);

    // Count the total number of memories for pagination information
    const totalMemories = orderedMemories.length;
    const totalPages = Math.ceil(totalMemories / limit); // Calculate total pages

    res.status(200).json({
      message: "Kitty memories fetched successfully",
      data: paginatedMemories || [],
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalMemories,
        itemsPerPage: limit,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// exports.getKittyMemoriesById = async (req, res) => {
//   const kittyId = req.params.id;
//   const userId = req.params.userId; // Extract userId from params if provided

//   const page = parseInt(req.query.page) || 0; // Default to page 1
//   const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page

//   const skip = page * limit; // Calculate the number of items to skip based on the page

//   try {
//     const getKitty = await Kitty.findById(kittyId)
//     .populate("kittyMemories.userId", "fullname") // Select the fullname field
//     .lean(); // Use .lean() to get plain JavaScript objects instead of Mongoose documents

//     if (!getKitty) {
//       return res.status(404).json({ error: "Kitty not found" });
//     }

//       const kittyMemories = getKitty.kittyMemories.slice(skip, skip + limit);

//     // Count the total number of memories for pagination information
//     const totalMemories = getKitty.kittyMemories.length;
//     const totalPages = Math.ceil(totalMemories / limit); // Calculate total pages



//     res.status(200).json({
//       message: "Kitty memories fetched successfully",
//       data: kittyMemories || [],
//       pagination: {
//         currentPage: page,
//         totalPages: totalPages,
//         totalItems: totalMemories,
//         itemsPerPage: limit,
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };


exports.deleteKittyById = async (req, res) => {
  const kittyId = req.params.id; // Capture the ID from request parameters

  try {
    const deletedKitty = await Kitty.findByIdAndDelete(kittyId);

    if (!deletedKitty) {
      return res.status(404).json({ error: "Kitty not found" });
    }

    res.status(200).json({ message: "Kitty deleted successfully" });
  } catch (error) {
    console.error("Error deleting Kitty:", error);
    res
      .status(500)
      .json({ error: "Failed to delete Kitty", details: error.message });
  }
};

exports.updateKittyStatus = async (req, res) => {
  const kittyId = req.params.id; // Capture the ID from request parameters
  const { isActive } = req.body;

  try {
    const updatedKitty = await Kitty.findByIdAndUpdate(
      kittyId,
      { isActive },
      { new: true, runValidators: true }
    );

    if (!updatedKitty) {
      return res.status(404).json({ error: "Kitty not found" });
    }

    res
      .status(200)
      .json({ message: "Data updated successfully", data: updatedKitty });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update data", details: error.message });
  }
};




// Function to calculate distance between two points using the Haversine formula
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

// exports.getNearByKitty = async (req, res) => {
//   try {
//     const { lat, long } = req.body;
//     const userId = req.params.id; 

//     if (!userId) {
//       return res.status(400).json({ error: 'User ID is required' });
//     }
//     let latitude;
//     let longitude;

//     if (!lat || !long) {
//       const user = await UserSchema.findById(userId).select('location'); 
//       if (!user || !user.location) {
//         return res.status(400).json({ error: 'User location not found' });
//       }

//       const userLocation = user.location; 

//       const axiosres = await axios.get(`https://api.olamaps.io/places/v1/autocomplete?input=${userLocation}&api_key=TdoidCwf5FxL1rVCqS7KnbWT8Gq561obQaMWzBoR`);

//       const locationData = axiosres.data.predictions[0].geometry.location;

//       if (!locationData || !locationData.lat || !locationData.lng) {
//         return res.status(400).json({ error: 'Unable to retrieve latitude and longitude from location' });
//       }

//       latitude = parseFloat(locationData.lat); 
//       longitude = parseFloat(locationData.lng); 
//     } else {
//       latitude = parseFloat(lat);
//       longitude = parseFloat(long);
//     }    

//     // Getting today's date
//     const today = new Date();
//     today.setUTCHours(0, 0, 0, 0);

//     // Find all venues
//     const venues = await Venue.find().select('_id lat long');

//     // Filter venues within 10 km radius
//     const nearbyVenueIds = venues
//       .filter(venue => {
//         const venueLat = parseFloat(venue.lat);
//         const venueLong = parseFloat(venue.long);
//         const distance = getDistanceFromLatLonInKm(latitude, longitude, venueLat, venueLong);
//         return distance <= 10;
//       })
//       .map(venue => venue._id);

//     const kittiesWithApprovedCount = await Kitty.find({ venueId: { $in: nearbyVenueIds } })
//       .populate({
//         path: 'venueId',
//         select: 'name location lat long pricing',
//       })
//       .populate({
//         path: 'themeId',
//         select: 'name',
//       })
//       .populate({
//         path: 'groupId', // Make sure it supports arrays
//         select: '_id groupType name userId userIds',
//       })
//       .populate({
//         path: 'userId', 
//         select: '_id',
//       })
//       .populate({
//         path: 'members.userId', 
//         select: '_id'
//       })
//       .exec();

//     const filteredKitties = kittiesWithApprovedCount.filter(kitty => {
//       const [day, month, year] = kitty.date.split('/').map(Number);
//       const kittyDate = new Date(year, month - 1, day);

//       const isFutureKitty = kittyDate >= today;
//       const isPublicGroup =
//         kitty.groupId &&
//         Array.isArray(kitty.groupId) &&
//         kitty.groupId.some(group => group.groupType === 'public');

//         // const isUserMember = kitty.members.some(
//         //   // member => member.userId.toString() === userId
//         //   member => member.userId && member.userId.toString() === userId

//         // );
//         const isUserRequestedInGroup = kitty.groupId?.some(group =>
//           group.userIds?.some(userObj =>
//             userObj.userId?.toString() === userId && userObj.status === 'isrequesteduser'
//           )
//         );
//         const isUserRequestedInMembers = kitty.members?.some(
//           member => member.userId?.toString() === userId && member.status === 'isrequesteduser'
//         );

//         const isUserNotInKitty = !kitty.members.some(member => member.userId?.toString() === userId) && 
//         !kitty.groupId.some(group => group.userIds?.some(userObj => userObj.userId?.toString() === userId));
//         // const isUserGroupCreator = kitty.groupId?.some(group =>
//         //   group.userId?._id?.toString() === userId
//         // );
//         const isUserCreatorOfKitty = kitty.userId && kitty.userId._id?.toString() === userId;

//         const isUserGroupMember = kitty.groupId?.some(group =>
//           group.userIds?.some(userObj =>
//             userObj.userId?.toString() === userId
//           )
//         );
  
//         return isFutureKitty && isPublicGroup && (isUserRequestedInGroup || isUserRequestedInMembers || isUserNotInKitty);

//       // return isFutureKitty && isPublicGroup  && !isUserMember && !isUserGroupMember && !isUserCreatorOfKitty;
//     });

//     // Adding approved members count
//     const kitties = filteredKitties.map(kitty => {
//       const approvedCount = kitty.members.filter(member => member.status === 'approved').length;
//       return {
//         ...kitty.toObject(),
//         approvedMembersCount: approvedCount,
//       };
//     });

//     return res.status(200).json({ success: true, kitties });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

exports.getNearByKitty = async (req, res) => {
  try {
    const { lat, long } = req.body;
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    let latitude;
    let longitude;

    if (!lat || !long) {
      const user = await UserSchema.findById(userId).select('location');
      if (!user || !user.location) {
        return res.status(400).json({ error: 'User location not found' });
      }

      const userLocation = user.location;

      const axiosres = await axios.get(`https://api.olamaps.io/places/v1/autocomplete?input=${userLocation}&api_key=TdoidCwf5FxL1rVCqS7KnbWT8Gq561obQaMWzBoR`);

      const locationData = axiosres.data.predictions[0].geometry.location;

      if (!locationData || !locationData.lat || !locationData.lng) {
        return res.status(400).json({ error: 'Unable to retrieve latitude and longitude from location' });
      }

      latitude = parseFloat(locationData.lat);
      longitude = parseFloat(locationData.lng);
    } else {
      latitude = parseFloat(lat);
      longitude = parseFloat(long);
    }

    // Getting today's date
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Find all venues
    const venues = await Venue.find().select('_id lat long');

    // Filter venues within 10 km radius
    const nearbyVenueIds = venues
      .filter(venue => {
        const venueLat = parseFloat(venue.lat);
        const venueLong = parseFloat(venue.long);
        const distance = getDistanceFromLatLonInKm(latitude, longitude, venueLat, venueLong);
        return distance <= 10;
      })
      .map(venue => venue._id);

    const kittiesWithApprovedCount = await Kitty.find({ venueId: { $in: nearbyVenueIds } })
      .populate({
        path: 'venueId',
        select: 'name location lat long pricing',
      })
      .populate({
        path: 'themeId',
        select: 'name',
      })
      .populate({
        path: 'groupId', // Make sure it supports arrays
        select: '_id groupType name userId userIds',
      })
      .populate({
        path: 'userId', 
        select: '_id',
      })
      .populate({
        path: 'members.userId', 
        select: '_id'
      })
      .exec();

      const filteredKitties = kittiesWithApprovedCount.filter(kitty => {
        const [day, month, year] = kitty.date.split('/').map(Number);
        const kittyDate = new Date(year, month - 1, day);
      
        const isFutureKitty = kittyDate >= today;
      
        const isPublicGroup =
          kitty.groupId &&
          Array.isArray(kitty.groupId) &&
          kitty.groupId.some(group => group.groupType === 'public');
      
        // ✅ Fixed comparison for approved members
        const isUserApprovedInMembers = kitty.members?.some(
          member => member.userId?._id?.toString() === userId && member.status === 'approved'
        );
        if (isUserApprovedInMembers) {
          return false;
        }
      
        const isUserRequestedInGroup = kitty.groupId?.some(group =>
          group.userIds?.some(userObj =>
            userObj.userId?.toString() === userId && userObj.status === 'isrequesteduser'
          )
        );
      
        const isUserRequestedInMembers = kitty.members?.some(
          member => member.userId?._id?.toString() === userId && member.status === 'isrequesteduser'
        );
      
        const isUserNotInKitty =
          !kitty.members?.some(member => member.userId?._id?.toString() === userId) &&
          !kitty.groupId?.some(group =>
            group.userIds?.some(userObj => userObj.userId?.toString() === userId)
          );
      
        return isFutureKitty && isPublicGroup &&
               (isUserRequestedInGroup || isUserRequestedInMembers || isUserNotInKitty);
      });
      
      

    // Adding approved members count
    const kitties = filteredKitties.map(kitty => {
      const approvedCount = kitty.members.filter(member => member.status === 'approved').length;
      return {
        ...kitty.toObject(),
        approvedMembersCount: approvedCount,
      };
    });

    return res.status(200).json({ success: true, kitties });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};




exports.submitKittyReview = async (req, res) => {
  const kittyId = req.params.id; // Extract Kitty ID from route parameter
  const reviewData = req.body;  // Extract review data from request body

  try {
    if (!kittyId) {
      return res.status(400).json({ error: 'KittyId is required' });
    }
    if (!req.body.rating || !req.body.userId) {
      return res.status(400).json({ error: 'Rating and userId is required' });

    }


    // Update the Kitty with the new review
    let kittyData = await Kitty.findByIdAndUpdate(
      kittyId,
      { $push: { kittyReviews: reviewData } },
      { new: true, runValidators: true }
    );

    return res.status(200).json({ kittyData, success: true, message: 'Review Submitted Successfully' });
  } catch (error) {
    console.error('Error adding review:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.quitKittyByUser = async (req, res) => {
  const kittyId = req.params.id; // Extract Kitty ID from route parameter
  const userId = req.body.userId; // Extract userId from request body

  try {
    if (!kittyId) {
      return res.status(400).json({ error: 'KittyId is required' });
    }
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Fetch the Kitty to check if the user exists in the members array
    const kitty = await Kitty.findById(kittyId);
    if (!kitty) {
      return res.status(404).json({ error: 'Kitty not found' });
    }

    const memberExists = kitty.members.some(
      (member) => member.userId.toString() === userId && member.status === 'approved'
    );

    if (!memberExists) {
      return res.status(400).json({ error: 'User not found in approved members of this Kitty' });
    }

    // Update the Kitty and remove the user from the `members` array
    const updatedKitty = await Kitty.findByIdAndUpdate(
      kittyId,
      {
        $pull: { members: { userId: userId, status: 'approved' } },
      },
      { new: true }
    );

    return res.status(200).json({ success: true, message: 'User successfully quit the Kitty', data: updatedKitty });
  } catch (error) {
    console.error('Error quitting Kitty:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.sendKittyReminderToUser = async (req, res) => {
  try {
    const { userId, kittyId, requestUserId } = req.body;

    // Validate required fields
    if (!userId || !kittyId || !requestUserId) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Check if user exists
    const user = await UserSchema.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Check if kitty exists
    const kitty = await Kitty.findById(kittyId);
    if (!kitty) {
      return res.status(404).json({ error: "Kitty not found." });
    }

    // Create a notification
    const notification = new NotificationSchema({
      userId,
      kittyId,
      message: `${kitty?.name} reminding you this please join`,
      type: "kitty",
      status: "pending",
      isRead: false,
    });

    // Save the notification to the database
    await notification.save();

    // Respond to the request
    return res.status(201).json({
      success: true,
      message: "Reminder sent successfully!",
      notification,
    });
  } catch (error) {
    console.error("Error sending reminder:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};


exports.getKittySummary = async (req, res) => {
  try {
    const { kittyId } = req.params;

    if (!kittyId) {
      return res.status(400).json({ error: "Kitty ID is required" });
    }

    // Aggregation to calculate total contribution, expense, and their counts
    const result = await WalletSchema.aggregate([
      { $match: { kittyId: new mongoose.Types.ObjectId(kittyId) } }, // Filter by kittyId
      {
        $group: {
          _id: "$kittyId",
          totalContribution: {
            $sum: {
              $cond: [{ $eq: ["$transactionType", "Contribution"] }, "$amount", 0],
            },
          },
          totalExpense: {
            $sum: {
              $cond: [{ $eq: ["$transactionType", "Expense"] }, "$amount", 0],
            },
          },
          contributionCount: {
            $sum: { $cond: [{ $eq: ["$transactionType", "Contribution"] }, 1, 0] },
          },
          expenseCount: {
            $sum: { $cond: [{ $eq: ["$transactionType", "Expense"] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalContribution: 1,
          totalExpense: 1,
          contributionCount: 1,
          expenseCount: 1,
          savedAmount: { $subtract: ["$totalContribution", "$totalExpense"] }, // Calculate saved amount
          totalAmount: { $add: ["$totalContribution", "$totalExpense"] }, // Calculate total transaction amount
          totalTransactions: { $add: ["$contributionCount", "$expenseCount"] }, // Total transaction count
        },
      },
    ]);

    if (!result.length) {
      return res.status(404).json({ message: "No transactions found for this kitty" });
    }

    res.status(200).json({ success: true, data: result[0] });
  } catch (error) {
    console.error("Error fetching kitty summary:", error);
    res.status(500).json({ error: "An error occurred while fetching kitty summary" });
  }
};

