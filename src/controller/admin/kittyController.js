require('dotenv').config();
const Kitty = require("../../schema/kittySchema");
const Venue = require("../../schema/venueSchema");
const FcmToken = require('../../schema/FcmSchema'); // Your FCM schema

const VenueReviewSchema = require("../../schema/venueReviewSchema");
const NotificationSchema = require("../../schema/notificationSchema");
const UserSchema = require("../../schema/userSchema");
const GroupSchema = require("../../schema/groupSchema");
const WalletSchema = require("../../schema/walletSchema");
const moment = require("moment"); // For date and time parsing

const mongoose = require("mongoose");

exports.checkLatestVersion = async(req, res)=>{
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
//       theamepoll,   // Updated to poll structure
//       locationpoll, // Updated to poll structure
//       venuepoll     // Updated to poll structure
//     } = req.body;

//     // Validate and structure the poll data
//     const theamePollData = theamepoll ? {
//       question: theamepoll.question,
//       options: theamepoll.options.map(option => ({
//         optionText: option.optionText,
//         votes: option.votes || 0  // Default to 0 if not provided
//       })),
//       type: 'theampolls'
//     } : null;

//     const locationPollData = locationpoll ? {
//       question: locationpoll.question,
//       options: locationpoll.options.map(option => ({
//         optionText: option.optionText,
//         votes: option.votes || 0
//       })),
//       type: 'locationpolls'
//     } : null;

//     const venuePollData = venuepoll ? {
//       question: venuepoll.question,
//       options: venuepoll.options.map(option => ({
//         optionText: option.optionText,
//         votes: option.votes || 0
//       })),
//       type: 'venuepolls'
//     } : null;

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
//       theamepoll: theamePollData,   // Add structured poll data
//       locationpoll: locationPollData, // Add structured poll data
//       venuepoll: venuePollData,     // Add structured poll data
//     });

//     // Save the new Kitty to the database
//     await newKitty.save();

//     // Send success response
//     res.status(201).json({ message: "Kitty added successfully", data: newKitty });
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

    // Create new Kitty with poll data
    const newKitty = new Kitty({
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
      theamepoll: theamePollData,
      locationpoll: locationPollData,
      venuepoll: venuePollData,
    });

    // Save the new Kitty to the database
    await newKitty.save();

    //notification work------------>>>
    // Fetch group details to get userIds
    const group = await GroupSchema.findById(groupId).select("userIds name contributionAmount");

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Create notifications for the userId (kitty creator)
    const creatorNotification = {
      userId, // The creator's userId
      kittyId: newKitty._id,
      message: `You have created a kitty: ${newKitty.name}`,
      type: "kitty",
    };
    console.log(group);
    console.log(group.contributionAmount)

    // Create notifications for all users in the group
    const userNotifications = group.userIds.map((user) => ({
      userId: user.userId, // assuming userIds is an array of objects with userId field
      groupId: groupId,
      kittyId: newKitty._id,
      message: `A new kitty has been created in your group: ${newKitty.name}`,
      type: "kitty",
    }));

    // Combine notifications for the creator and the group users
    const allNotifications = [creatorNotification, ...userNotifications];

    // Insert all notifications into the database
    await NotificationSchema.insertMany(allNotifications);

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
    // if (groupId && !mongoose.Types.ObjectId.isValid(groupId)) {
    //   return res.status(400).json({ error: "Invalid groupId" });
    // }
    if (groupId) {
      if (mongoose.Types.ObjectId.isValid(groupId)) {
        groupId = [groupId]; // Ensure it's an array with a valid ObjectId
      }
    }
    if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    if (time && typeof time !== "string") {
      return res.status(400).json({ error: "Time must be a string" });
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
      ...(groupId && { groupId }),
      ...(userId && { userId }),
      ...(date && { date }),
      ...(time && { time }),
      ...(image && { image }),
      ...(themeId && { themeId }),
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

// exports.getKittyAttendance = async (req, res) => {
//   try {
//       const { userId } = req.params; // Assuming userId is passed as a route parameter

//       // Find the kitty where the userId is inside the members array
//       let kittyincludes = await Kitty.find({
//           members: {
//               $elemMatch: { userId }  // Find kitty with this userId in the members array
//           }
//       });

//       if (!kittyincludes) {
//           return res.status(404).json({ message: "Kitty not found for this user" });
//       }

//       // Filter members where status is 'approved'
//       const approvedMembers = kittyincludes.members.filter(member => member.status === 'approved');

//       // Get the count of approved members
//       const approvedCount = approvedMembers.length;

//       // Respond with the count and kitty details
//       res.status(200).json({counts :approvedCount || 0});
//   } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Server error", error });
//   }
// };

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

exports.getAllPastAndFutureKitties = async (req, res) => {
  try {
    const { type } = req.query; // Fetch type parameter
    const now = new Date(); // Current date and time in JavaScript

    // Function to combine date and time into a Date object
    const combineDateAndTime = (dateStr, timeStr) => {
      const dateParts = dateStr.split(/[\/-]/).map(Number); // Split date by '/' or '-'
      const [day, month, year] =
        dateParts.length === 3 ? dateParts : [null, null, null];
      const [time, modifier] = timeStr.split(" "); // Split time by space to get time and AM/PM

      // Convert time to 24-hour format
      const [hours, minutes] = time.split(":").map(Number);
      const hours24 = modifier === "PM" && hours !== 12 ? hours + 12 : hours;
      const completeDate = new Date(year, month - 1, day, hours24, minutes);

      return completeDate;
    };

    // Fetch all kitties to manually filter in the app
    const allKitties = await Kitty.find({})
      .populate({
        path: "groupId",
        populate: {
          path: "userId",
          model: "Users",
        },
      })
      .populate("userId")
      .populate("venueId")
      .populate("themeId")
      .populate("colorId")
      .populate("addressId");

    // Filter kitties based on combined date and time
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

      // For future kitties, sort ascending (nearest future date first)
      // For past kitties, sort descending (most recent past date first)
      if (type === "future") {
        return dateTimeA - dateTimeB; // Ascending order
      } else if (type === "past") {
        return dateTimeB - dateTimeA; // Descending order
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

    const currentTime = moment(); // Current date and time

    // Fetch all kitties with optional name search
    const query = {};
    if (name) {
      query.name = { $regex: new RegExp(name, "i") };
    }

    let KittyData = await Kitty.find(query)
      .lean()
      .populate("venueId", "name")
      .populate("groupId", "name contributionAmount")
      .populate("themeId", "name");

    // Filter kitties by future date and time
    const filteredKitties = KittyData.filter((kitty) => {
      const kittyDateTime = moment(
        kitty.date + " " + kitty.time,
        "DD/MM/YYYY hh:mm A"
      );
      return kittyDateTime.isAfter(currentTime);
    });

    // Total records after filtering
    const totalKitties = filteredKitties.length;

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const paginatedKitties = limit
      ? filteredKitties.slice(startIndex, startIndex + parseInt(limit))
      : filteredKitties;

    // Modify response to add `kittymemberstatus` for each kitty
    const response = paginatedKitties.map((kitty) => {
      const member = kitty.members.find(
        (member) => member.userId.toString() === userId
      );
      let kittymemberstatus = "guest"; // Default if not in members array

      // Set status based on membership or if the user is the host
      if (member) {
        kittymemberstatus =
          member.status === "approved"
            ? "member"
            : member.status === "rejected"
            ? "rejected"
            : "requested";
      } else if (kitty.userId.toString() === userId) {
        kittymemberstatus = "host";
      } else {
        kittymemberstatus = "notmember";
      }

      return {
        ...kitty,
        kittymemberstatus,
      };
    });

    // Response metadata
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

exports.joinKitty = async (req, res) => {
  try {
    const { kittyId, requestUserId, status } = req.body;

    // Find the kitty by ID
    const kitty = await Kitty.findById(kittyId);

    if (!kitty) {
      return res.status(404).json({ message: "Kitty not found" });
    }

    // Check if the user is already in the members array
    const existingMemberIndex = kitty.members.findIndex(
      (member) => member.userId && member.userId.toString() === requestUserId
    );

    if (existingMemberIndex !== -1) {
      // User is already a member, update their status
      kitty.members[existingMemberIndex].status = status;
    } else {
      // User is not a member, add them to the members array
      const newMember = {
        userId: requestUserId,
        status: status, // Set the status
      };
      kitty.members.push(newMember); // Push the new member to the array
    }

    // Save the updated kitty document
    const updatedKitty = await kitty.save();

    const user = await UserSchema.findById(requestUserId).select("fullname");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send a notification to the kitty admin
    const adminNotification = new NotificationSchema({
      userId: kitty.userId, // Notification to the group admin
      kittyId: kittyId,
      requestUserId: requestUserId,
      message: `${user.fullname} has requested to join your Kitty: ${kitty.name}`,
      type: "kitty-join-request",
    });
   
    // Save the notification
    await adminNotification.save();
    const fcmTokens = await FcmToken.find({ userId: kitty.userId,deviceType: 'Android',});
    const tokens = fcmTokens
    .map(tokenDoc => tokenDoc.fcmToken)
  
        const payload = {
          notification: {
              title: kitty.name,
              body: adminNotification?.message,
              image: 'your_image_url', // Optional image URL if needed
          },
          data: {
              route: 'your_route', 
              title: kitty.name,
              body: adminNotification?.message,
          },
      };
    
      const options = {
          priority: "high",
      };
    
      // Send notification to each token using the send method
      if(tokens?.length > 0){

        const response = await Promise.all(tokens.map(token =>
            admin.messaging().send({
                token: token,
                notification: payload.notification,
                data: payload.data,
                android: {
                    priority: options.priority,
                },
            })
        ));
      }
    

    return res
      .status(200)
      .json({ message: "Member status updated successfully", updatedKitty });
  } catch (error) {
    console.log("the error is", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
exports.acceptOrRejectRequestOfKitty = async (req, res) => {
  try {
    const { notificationId, status, kittyId, userId } = req.body;

    // Check for required fields
    if (!kittyId || !userId || !status || !notificationId) {
      return res.status(400).json({
        message: "kittyId, userId, status, and notificationId are required",
      });
    }

    // Find the Kitty document by ID
    let findWhichKitty = await Kitty.findById(kittyId);
    if (!findWhichKitty) {
      return res.status(404).json({ message: "Kitty not found" });
    }

    // Find the specific member in the Kitty's members array
    const memberIndex = findWhichKitty.members.findIndex(
      (member) => member.userId.toString() === userId.toString()
    );

    if (memberIndex === -1) {
      return res.status(404).json({ message: "Member not found in the Kitty" });
    }

    // Check if the member's status is already approved
    if (findWhichKitty.members[memberIndex].status === 'approved') {
      return res.status(400).json({ message: "Request has already been approved" });
    }

    // Update the member's status
    findWhichKitty.members[memberIndex].status = status;

    // Save the updated Kitty document
    await findWhichKitty.save();

    // Prepare notification messages based on the status
    const notificationMessage =
      status === "approved"
        ? `Your request to join the Kitty: ${findWhichKitty.name} has been approved.`
        : `Your request to join the Kitty: ${findWhichKitty.name} has been rejected.`;

    const hostNotificationMessage =
      status === "approved"
        ? `You have accepted the invitation for Kitty: ${findWhichKitty.name}.`
        : `You have rejected the invitation for Kitty: ${findWhichKitty.name}.`;

    // Log the messages for debugging
    console.log(notificationMessage, hostNotificationMessage);

    // Update or create the notification for the host
    await NotificationSchema.findByIdAndUpdate(
      notificationId,
      { message: hostNotificationMessage, type: "kitty" },
      { new: true, upsert: true } // upsert ensures creation if the notification doesn't exist
    );

    // Send a new notification to the user
    const userNotification = new NotificationSchema({
      userId, // Notification for the user
      kittyId: kittyId,
      message: notificationMessage,
      type: "kitty",
    });

    await userNotification.save();
    const fcmTokens = await FcmToken.find({ userId: userId,deviceType: 'Android',});
    const tokens = fcmTokens
    .map(tokenDoc => tokenDoc.fcmToken)
  
        const payload = {
          notification: {
              title: findWhichKitty.name,
              body: notificationMessage,
              image: 'your_image_url', // Optional image URL if needed
          },
          data: {
              route: 'your_route', 
              title: findWhichKitty.name,
              body: notificationMessage,
          },
      };
    
      const options = {
          priority: "high",
      };
    
      // Send notification to each token using the send method
      if(tokens?.length > 0){

        const response = await Promise.all(tokens.map(token =>
            admin.messaging().send({
                token: token,
                notification: payload.notification,
                data: payload.data,
                android: {
                    priority: options.priority,
                },
            })
        ));
      }

    // Respond with success message
    res.status(200).json({ message: `Request ${status}` });
  } catch (error) {
    // Handle errors
    console.error(error); // Log the error for debugging
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

    let venueRev = await VenueReviewSchema.find({ venueId: getKitty?.venueId });
    res
      .status(200)
      .json({
        message: "Kitty fetched successfully",
        data: getKitty,
        Venuereviews: venueRev?.length || 0,
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
      .populate("kittyMemories.userId", "fullname") // Select the fullname field
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
  console.log(kittyId);

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

  console.log(req.body, "response");

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
    console.error("Error updating data", error);
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

exports.getNearByKitty = async (req, res) => {
  try {
    const { lat, long } = req.body;

    if (!lat || !long) {
      return res.status(400).json({ error: 'Latitude and longitude are required.' });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(long);

    // Find all venues (since we don’t have a geospatial index in this schema)
    const venues = await Venue.find().select('_id lat long');

    // Filter venues within 5 km radius
    const nearbyVenueIds = venues
      .filter(venue => {
        const venueLat = parseFloat(venue.lat);
        const venueLong = parseFloat(venue.long);
        const distance = getDistanceFromLatLonInKm(latitude, longitude, venueLat, venueLong);
        return distance <= 5;
      })
      .map(venue => venue._id);

    // Find kitties associated with the nearby venues
    const   kittiesWithApprovedCount= await Kitty.find({ venueId: { $in: nearbyVenueIds } })
      .populate({
        path: 'venueId',
        select: 'name location lat long pricing',  // Include venue name, location, lat, and long
      }).populate('themeId','name')
      .exec();

      const  kitties= kittiesWithApprovedCount.map(kitty => {
        const approvedCount = kitty.members.filter(member => member.status === 'approved').length;
        return {
          ...kitty.toObject(),
          approvedMembersCount: approvedCount
        };
      });

    return res.status(200).json({ success: true,kitties });
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
    if(!req.body.rating || !req.body.userId){
      return res.status(400).json({ error: 'Rating and userId is required' });

    }


    // Update the Kitty with the new review
    await Kitty.findByIdAndUpdate(
      kittyId,
      { $push: { kittyReviews: reviewData } },
      { new: true, runValidators: true }
    );

    return res.status(200).json({ success: true, message: 'Review Submitted Successfully' });
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

