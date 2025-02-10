const Group = require("../../schema/groupSchema");
const KittySchema = require("../../schema/kittySchema");
const GroupFrequencyModel = require("../../schema/groupFrequencySchema");
const GroupInterestModel = require("../../schema/groupInterestSchema");
const GroupInterest = require("../../schema/groupInterestSchema");
const NotificationSchema = require("../../schema/notificationSchema"); // Import Notification model
const FcmToken = require('../../schema/FcmSchema'); // Your FCM schema
const { sendPushNotifications } = require('../../PushNotification/pushNotification');
const Users = require('../../schema/userSchema')

const mongoose = require("mongoose");


// controllers/groupControllers.js

exports.addGroup = async (req, res) => {
  try {
    const {
      name,
      userId, 
      userIds,
      groupInterestId,
      groupFrequencyId,
      groupType,
      description,
      rulesAndRegulation,
      groupCityArea,
      contributionAmount,
      image,
      referralCode
    } = req.body;

    // Validate required fields
    const requiredFields = [
      { name: 'name', value: name },
      { name: 'userId', value: userId },
      { name: 'groupType', value: groupType },
      { name: 'description', value: description },
      { name: 'rulesAndRegulation', value: rulesAndRegulation },
      { name: 'groupFrequencyId', value: groupFrequencyId },
      { name: 'groupCityArea', value: groupCityArea },
      { name: 'contributionAmount', value: contributionAmount },
      { name: 'image', value: image },
      { name: 'referralCode', value: referralCode }
    ];

    for (const field of requiredFields) {
      if (!field.value) {
        return res.status(400).json({ error: `${field.name} is required` });
      }
    }

    // Create a new group instance
    const newGroup = new Group({
      name,
      userId,
      userIds,
      groupInterestId,
      groupFrequencyId,
      groupType,
      description,
      rulesAndRegulation,
      groupCityArea,
      contributionAmount,
      image,
      referralCode
    });

    // Set status for userIds as 'approved'
    newGroup.userIds.forEach(item => {
      item.status = 'approved';
    });

    await newGroup.save();

    // Notification work ------------------------->>>>
    const creatorNotification = {
      userId, // the creator's userId
      groupId: newGroup._id,
      message: `You have created the group: ${newGroup.name}`,
      type: 'group',
    };

    // Save notifications for users with status 'approved'
    const approvedUserIds = newGroup.userIds
      .filter(item => item.status === 'approved')
      .map(item => item.userId);

    const userNotifications = approvedUserIds.map(userId => ({
      userId,
      groupId: newGroup._id,
      type: 'group',
      message: `You have been added to the group: ${newGroup.name}`,
    }));

    // Combine notifications for the creator and the users
    const allNotifications = [creatorNotification, ...userNotifications];

    // Insert all notifications into the database
    await NotificationSchema.insertMany(allNotifications);

    // Fetch FCM tokens for approved users
    const fcmTokens = await FcmToken.find({ userId: { $in: approvedUserIds } });
    console.log(fcmTokens, 'ffffff');

    // Ensure all tokens are valid, non-empty strings
    // const tokens = fcmTokens
    //   .map(tokenDoc => tokenDoc?.fcmToken)
    //   .filter(token => token && token.trim() !== ''); // Skip empty or invalid tokens
    const tokens = fcmTokens
  .flatMap((tokenDoc) => tokenDoc?.fcmToken) // Flatten nested arrays of fcmTokens
  .filter((token) => token && token.trim() !== ''); // Ensure tokens are valid and non-empty


    console.log(tokens, 'Filtered Tokens');

    if (tokens?.length > 0) {
      // Send notification to all the tokens
      await sendPushNotifications({
        title: 'Group Added', // Customize the title as needed
        message: `You have been added to the group: ${newGroup.name}`,
        userId: userId,
      });

      console.log('Notification sent');
    } else {
      console.log('No tokens found');
    }

    // Send the response only once, after everything is done
    res.status(201).json({ message: 'Group added successfully', group: newGroup });
  } catch (err) {
    console.error("Error adding group:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to add group' });
    }
  }
};


// exports.getAllGroups = async (req, res) => {
//   try {
//     const { page = 1, limit = 20, name = "", userId, interestName } = req.query;

//     const pageNumber = parseInt(page, 10);
//     const pageSize = parseInt(limit, 10);

//     const query = {};

//     if (name) {
//       query.name = { $regex: name, $options: "i" };
//     }

//     if (userId) {
//       const objectId = new mongoose.Types.ObjectId(userId);
//       query.$and = [
//         { groupType: { $eq: "public" } },
//         { userId: { $ne: objectId } },
//         { userIds: { $not: { $elemMatch: { userId: objectId, status: "approved" } } } },
//       ];
//     }

//     let interestIds = [];
//     if (interestName) {
//       const interestNamesArray = Array.isArray(interestName) ? interestName : [interestName];
//       const matchingInterests = await GroupInterest.find({ name: { $in: interestNamesArray } }).select("_id");
//       interestIds = matchingInterests.map((interest) => interest._id);
//     }

//     const interestQuery = interestIds.length > 0 ? { groupInterestId: { $in: interestIds } } : {};

//     // Count total interest-based groups
//     const totalInterestGroups = await Group.countDocuments({ ...query, ...interestQuery });

//     // Fetch paginated interest-based groups
//     const matchedGroups = await Group.find({ ...query, ...interestQuery })
//       .populate("userIds.userId", "_id fullname")
//       .populate("groupFrequencyId")
//       .populate("groupInterestId")
//       .populate({
//         path: "userId",
//         match: { isActive: true },
//       })
//       .sort({ createdAt: -1 })
//       .skip((pageNumber - 1) * pageSize)
//       .limit(pageSize);

//     //  Get the matched group IDs
//     const matchedGroupIds = matchedGroups.map((group) => group._id);

//     // Log to check matched group IDs
//     console.log("Matched Group IDs:", matchedGroupIds);

//     //Fetch remaining groups if needed
//     const remainingSlots = pageSize - matchedGroups.length;
//     let remainingGroups = [];
//     if (remainingSlots > 0) {
//       remainingGroups = await Group.find({
//         ...query,
//         _id: { $nin: matchedGroupIds }, // Exclude matched groups
//       })
//         .populate("userIds.userId", "_id fullname")
//         .populate("groupFrequencyId")
//         .populate("groupInterestId")
//         .populate({
//           path: "userId",
//           match: { isActive: true },
//         })
//         .sort({ createdAt: -1 })
//         .limit(remainingSlots);

//       // Log remaining groups
//       console.log("Remaining Groups Count:", remainingGroups.length);
//     }

//     // Combine results and deduplicate
//     const allGroups = [...matchedGroups, ...remainingGroups];

//     // Deduplicate based on _id
//     const uniqueGroups = Array.from(new Set(allGroups.map(group => group._id)))
//       .map(id => allGroups.find(group => group._id === id));

//     // Log total groups after deduplication
//     console.log("Total Groups After Deduplication:", uniqueGroups.length);

//     const groupsWithUserCount = uniqueGroups.map((group) => ({
//       ...group.toObject(),
//       userCount: group.userIds.length,
//       groupMemberStatus: (() => {
//         const member = group.userIds.find((mem) => mem?.userId?._id?.toString() == userId?.toString());
//         if (member) {
//           return member.status === "approved"
//             ? "approved"
//             : member.status === "pending"
//             ? "pending"
//             : "rejected";
//         }
//         return "join";
//       })(),
//     }));

//     const totalGroups = totalInterestGroups + remainingGroups.length;

//     res.status(200).json({
//       message: "Group List fetched successfully",
//       data: groupsWithUserCount,
//       totalGroups,
//       currentPage: pageNumber,
//       totalPages: Math.ceil(totalGroups / pageSize),
//       matchedGroups: matchedGroups.length,
//       remainingGroups: remainingGroups.length,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };






exports.getAllGroups = async (req, res) => {
  try {
    const { page = 1, limit = 20, name = "", userId, interestName } = req.query;

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    const query = {};

    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    if (userId) {
      const objectId = new mongoose.Types.ObjectId(userId);
      query.$and = [
        { groupType: { $eq: "public" } },
        { userId: { $ne: objectId } },
        { userIds: { $not: { $elemMatch: { userId: objectId, status: "approved" } } } },
      ];
    }

    let interestIds = [];
    if (interestName) {
      const interestNamesArray = Array.isArray(interestName) ? interestName : [interestName];

      const matchingInterests = await GroupInterest.find({ name: { $in: interestNamesArray } }).select("_id");
      interestIds = matchingInterests.map((interest) => interest._id);
    }

    const interestQuery = interestIds.length > 0 ? { groupInterestId: { $in: interestIds } } : {};

    // Count total interest-based groups
    const totalInterestGroups = await Group.countDocuments({ ...query, ...interestQuery });

    // Fetch paginated interest-based groups
    const matchedGroup = await Group.find({ ...query, ...interestQuery })
      .populate("userIds.userId", "_id fullname")
      // .populate("userId")
      .populate("groupFrequencyId")
      .populate("groupInterestId")
       .populate("userId", "userId.isActive")
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * pageSize) // Skip correctly based on page number
      .limit(pageSize);

    // const matchedGroupIds = matchedGroups.map((group) => group._id);
  //  const  matchedGroupIds = matchedGroups.filter(group => group.userId && group.userId.isActive);
  //   //   const matchedGroupIds = matchedGroups
  //   // .filter(group => group.userId !== null && group.userId.isActive)
  //   // .map(group => group._id);

  const matchedGroups = matchedGroup.filter(group => group.userId && group.userId.isActive);

  const matchedGroupIds = matchedGroups.map(group => group._id);

   
    const remainingSlots = pageSize - matchedGroups.length; // Remaining slots to fill

    let remainingGroups = [];
    if (remainingSlots > 0) {
      // Fetch remaining groups if interest groups are fewer than pageSize
      remainingGroups = await Group.find({
        ...query,
        _id: { $nin: matchedGroupIds },
      })
        .populate("userIds.userId", "_id fullname")
        .populate("userId")
        // .populate({
        //   path: "userId",
        //   match: { isActive: true},
        //   select: "_id  isActive"

        // })
        .populate("groupFrequencyId")
        .populate("groupInterestId")
        .sort({ createdAt: -1 })
        .limit(remainingSlots); 
    }

    const allGroups = [...matchedGroups, ...remainingGroups];


    const uniqueGroups = Array.from(new Set(allGroups.map(group => group._id))).map(id => allGroups.find(group => group._id === id));



    const groupsWithUserCount = uniqueGroups.map((group) => ({
      ...group.toObject(),
      userCount: group.userIds.length,
      groupMemberStatus: (() => {
        const member = group.userIds.find((mem) => mem?.userId?._id?.toString() == userId?.toString());
        if (member) {
          return member.status === "approved"
            ? "approved"
            : member.status === "pending"
            ? "pending"
            : "rejected";
        }
        return "join";
      })(),
    }));

    const totalGroups = totalInterestGroups + remainingGroups.length;

    res.status(200).json({
      message: "Group List fetched successfully",
      data: groupsWithUserCount,
      totalGroups,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalGroups / pageSize),
    });
    

 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};


 //get user via groupId
 exports.getUsersByGroupId = async (req, res) => {
  try {
    const { id } = req.params; 
  const group = await Group.findOne({ _id: id }).select("userIds.userId").lean().populate('userIds.userId');

    if (!group) {
      return res.status(404).json({ msg: "Group not found" });
    }

   
    const userIds = group.userIds.map(member => member.userId);

    res.status(200).json({ userIds });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};



exports.getGroupHostedByMe = async (req, res) => {
  try {
    const { page = 1, limit=10 , name = '' } = req.query; // Destructure query params
    const userId = req.params.id;

    // Convert page and limit to numbers
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    // Build search filter for group name
    const nameFilter = name ? { name: { $regex: name, $options: 'i' } } : {};

    // Fetch hosted groups
    const hostedGroups = await Group.find({ userId, ...nameFilter })
      .sort({ createdAt: -1 })
      .populate('groupInterestId') // Populate groupInterestId
      .populate('groupFrequencyId') // Populate groupFrequencyId
      .populate('userIds.userId', '_id fullname');

    // Fetch joined groups
    const joinedGroups = await Group.find({
      ...nameFilter,
      userIds: {
        $elemMatch: { userId, status: 'approved' },
      },
    })
    .sort({ createdAt: -1 })
    .populate('groupInterestId') // Populate groupInterestId
    .populate('groupFrequencyId') // Populate groupFrequencyId
    .populate('userIds.userId', '_id fullname');
    
    // Combine results
    let allGroups = [...hostedGroups, ...joinedGroups];
   
    allGroups = allGroups.map((group) => {
      if (group?.userIds && Array.isArray(group?.userIds)) {
        group.userIds = group.userIds.filter(user => user.userId != null);
      }
      return group;
    });
   

   

    
    // Total count for pagination
    const totalGroups = allGroups.length;
    
    // Paginate combined results
    const paginatedGroups = allGroups.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);

    // Check if no groups are found
    if (paginatedGroups.length === 0) {
      return res.status(404).json({ message: "No groups found hosted or joined by this user." });
    }

    res.status(200).json({
      message: "Groups fetched successfully",
      data: paginatedGroups,
      totalGroups,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalGroups / pageSize),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};




exports.addGroupMemories = async (req, res) => {
  try {
    const { kittyId, image, userId } = req.body;

    // Find the kitty by ID
    const kitty = await KittySchema.findById(kittyId);

    if (!kitty) {
      return res.status(404).json({ message: 'Kitty not found' });
    }

    // Extract the groupId from the kitty object
    const getGroupId = kitty?.groupId[0]?._id;
    
    
    // Fetch the group by its ID
    const groupdata = await Group.findById(getGroupId);
    
    if (!groupdata) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    // Check if the user is a member of the kitty or the creator
    const isMember = kitty?.members.find(member => member?.userId?.toString() === userId?.toString());
    const isCreator = kitty?.userId?.toString() === userId?.toString();
    
    if (isMember || isCreator) {
      // Add the new memory to the groupMemories array
      groupdata.groupMemories.push({
        memoryimage: image, // Assuming 'image' is the correct field name
        userId: userId, // Storing userId (assuming 'createdBy' field exists in schema)
      });      
      // Add the memory to the kitty's kittyMemories array
      kitty.kittyMemories.push({
        memoryimage: image, // Assuming 'image' is the correct field name
        userId: userId, // Storing userId 
      });     
      // Save the updated documents
      await groupdata.save();
      await kitty.save();
      
      res.status(200).json({ message: 'Memory added successfully', group: groupdata });
    } else {
      return res.status(400).json({ error: 'You are not a member, please join this kitty first' });
    }
  } catch (error) {
    console.error('Error adding memory:', error); // Log the error for debugging
    res.status(500).json({ message: 'Error adding memory', error: error.message || error });
  }
};





exports.getGroupById = async (req, res) => {
  const groupId = req.params.id;
  const { page = 0, limit = 10, userId, searchNumber } = req.query; // Get userId from query parameters
  const filter = userId ? { 'groupMemories.userId': userId } : {}; // Filter based on userId if provided
   
  try {
    const group = await Group.findById(groupId)
      .populate('userIds.userId')
      .populate('userId')
      .populate('groupFrequencyId')
      .populate('groupInterestId')
      .populate('groupMemories.userId');


    
    if (!group) {
      return res.status(404).json({ error: "Request not found" });
    }
    if (group.userIds) {
      group.userIds = group.userIds.filter((us) => us.userId !== null);
    }

    const users = await Users.find({ phoneNumber: { $in: group.userNumbers } }); 
    users.forEach(user => {
      const isUserAlreadyInGroup = group.userIds.some(member => String(member.userId._id) === String(user._id));
      if (!isUserAlreadyInGroup) {
        group.userIds.push({ userId: user, status: 'approved' });
        group.userNumbers = group.userNumbers.filter(num => num !== user.phoneNumber); 
      }
    });
    


    
    // Apply filter to groupMemories if userId is passed
    let filteredGroupMemories = group.groupMemories.filter(mem => 
      !userId || String(mem.userId._id) === String(userId) // Compare userIds to filter groupMemories
    );

    // Pagination logic
    const totalMemories = filteredGroupMemories.length;
    const paginatedMemories = filteredGroupMemories.slice(page * limit, (page * limit) + limit);

    group.groupMemories = paginatedMemories;

    res.status(200).json({
      data: group,
      members: group.userIds.length,
      pagination: {
        totalMemories, 
        currentPage: parseInt(page), 
        totalPages: Math.ceil(totalMemories / limit),
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};




exports.updateGroup = async (req, res) => {

  try {

   const updateData = {}; 
   Object.keys(req.body).forEach((key) => {
    if (req.body[key] !== undefined && req.body[key] !== null) {
      updateData[key] = req.body[key];
  }
});
//Validating fields 
if (Object.keys(updateData).length === 0) {
  return res.status(400).json({ error: "No valid fields provided for update" });
} 


// add new member to group 
const group = await Group.findById(req.params.id);
if (!group) {
  return res.status(404).json({ error: "Group not found" });
}


if (!Array.isArray(group.userNumbers)) {
  group.userNumbers = [];
}

// Check and add new userNumbers
if (req.body.userNumbers && Array.isArray(req.body.userNumbers)) {
  const newNumbers = req.body.userNumbers.filter(num => !group.userNumbers.includes(num));

  if (newNumbers.length > 0) {
    group.userNumbers.push(...newNumbers);
    group.markModified("userNumbers"); 
  }
}

delete updateData.userNumbers


// Update other fields
Object.assign(group, updateData);

// Save the updated group
await group.save();


res.status(200).json({ message: "Group updated successfully", group });


  } catch (err) {
    console.error("Error updating group:", err);
    res.status(500).json({ error: "Failed to update group" });
  }
}; 

  
exports.deleteGroup = async (req, res) => {
  try {
    const deletedgroup = await Group.findByIdAndDelete(req.params.id);
    if (!deletedgroup) {
      return res.status(404).json({ error: "Data not found" });
    }
    res.status(200).json({ message: "Data deleted successfully" });
  } catch (err) {
    console.error("Error deleting group:", err);
    res.status(500).json({ error: "Failed to delete group" });
  }
};

//group Frequency
exports.addGroupFrequency = async (req, res) => {
  try {
    const {
        name ,
        userId,
        createdBy
    } = req.body;
    const newGroupCat= new GroupFrequencyModel({
        name ,
        userId,
        createdBy
    });

    await newGroupCat.save();

    res.status(201).json({ message: "Group Frequency added successfully", task: newGroupCat });
  } catch (err) {
    res.status(500).json({ error: "Failed to add GroupFrequency" });
  }
};

exports.getAllGroupsFrequencyOfUser = async (req, res) => {
  try {
    const userId = req.params.id; // Extract userId from request parameters
    const objectIdUserId = new mongoose.Types.ObjectId(userId);

  
    const getadminfre = await GroupFrequencyModel.find({ createdBy: 'admin' }).sort({ createdAt: -1 });
    const getuserfre = await GroupFrequencyModel.find({userId:objectIdUserId}).sort({ createdAt: -1 });

    const getAllFrequency = [...getadminfre,...getuserfre]

   

    res.status(200).json({
      message: "Activities retrieved successfully",
      data: { events: getAllFrequency }, // Wrap activities in an events object
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to get information",
      details: err.message, // Include error details for debugging
    });
  }
};

exports.getAllGroupsFrequency = async (req, res) => {
  try {
    const getAllGroupCat = await GroupFrequencyModel.find().sort({ name: 1 }) ;
   
    res
      .status(200)
      .json({ message: "Group Frequency List fetched successfully", data: getAllGroupCat });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getGroupFrequencyById = async (req, res) => {
  const groupcatId = req.params.id;

  try {
    const groupc = await GroupFrequencyModel.findById(groupcatId);
    if (!groupc) {
      return res.status(404).json({ error: "Request not found" });
    }

    res.status(200).json(groupc);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user by ID" });
  }
};

exports.updateFrequencyGroup = async (req, res) => {
  try {
    const {
        name ,
      } = req.body;
    const updatedcatGroup = await GroupFrequencyModel.findByIdAndUpdate(
      req.params.id,
    {
        name ,
    },
      { new: true }
    );
    if (!updatedcatGroup) {
      return res.status(404).json({ error: "Group not found" });
    }
    res.status(200).json(updatedcatGroup);
  } catch (err) {
    console.error("Error updating Group:", err);
    res.status(500).json({ error: "Failed to update Group" });
  }
};
exports.deleteFrequencyGroup = async (req, res) => {
  try {
    const deletedgroupcat = await GroupFrequencyModel.findByIdAndDelete(req.params.id);
    if (!deletedgroupcat) {
      return res.status(404).json({ error: "Data not found" });
    }
    res.status(200).json({ message: "Data deleted successfully" });
  } catch (err) {
    console.error("Error deleting group:", err);
    res.status(500).json({ error: "Failed to delete group" });
  }
};




//group Interest
exports.addGroupInterest = async (req, res) => {
  try {
    const {
        name ,
    } = req.body;
    const newGroupInt= new GroupInterestModel({
        name ,
    });

    await newGroupInt.save();

    res.status(201).json({ message: "Group Interest added successfully", task: newGroupInt });
  } catch (err) {
    res.status(500).json({ error: "Failed to add GroupInterest" });
  }
};
exports.getAllGroupsInterest = async (req, res) => {
  try {
    const getAllGroupInt = await GroupInterestModel.find().sort({ createdAt: -1 }) ;
   
    res
      .status(200)
      .json({ message: "Group Interest List fetched successfully", data: getAllGroupInt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getGroupInterestById = async (req, res) => {
  const groupintId = req.params.id;

  try {
    const groupint = await GroupInterestModel.findById(groupintId);
    if (!groupint) {
      return res.status(404).json({ error: "Request not found" });
    }

    res.status(200).json(groupint);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user by ID" });
  }
};

exports.updateInterestGroup = async (req, res) => {
  try {
    const {
        name ,
      } = req.body;
    const updatedcatGroup = await GroupInterestModel.findByIdAndUpdate(
      req.params.id,
    {
        name ,
    },
      { new: true }
    );
    if (!updatedintGroup) {
      return res.status(404).json({ error: "Group not found" });
    }
    res.status(200).json(updatedintGroup);
  } catch (err) {
    console.error("Error updating Group:", err);
    res.status(500).json({ error: "Failed to update Group" });
  }
};
exports.deleteInterestGroup = async (req, res) => {
  try {
    const deletedgroupint = await GroupInterestModel.findByIdAndDelete(req.params.id);
    if (!deletedgroupint) {
      return res.status(404).json({ error: "Data not found" });
    }
    res.status(200).json({ message: "Data deleted successfully" });
  } catch (err) {
    console.error("Error deleting group:", err);
    res.status(500).json({ error: "Failed to delete group" });
  }
};




exports.updateStatus = async (req, res)=>{
  const GroupId = req.params.id; // Capture the ID from request parameters
  const {
    isActive
  } = req.body;

  console.log(req.body, "response");

  try {
    const updatedGroup = await Group.findByIdAndUpdate(
      GroupId,
      {
        isActive
      },
      { new: true, runValidators: true } 
    );

    if (!updatedGroup) {
      return res.status(404).json({
        error: "Group not found",
      });
    }

    // Send the updated user data with a 200 status code
    res.status(200).json({
      message: "Group information updated successfully",
      data: updatedGroup,
    });
  } catch (error) {
    console.error("Error updating group information:", error);
    res.status(500).json({
      error: "Failed to update group information",
      details: error.message,
    });
  }
}



exports.addUserRequest = async (req, res) => {
  const { groupId } = req.params;
  const { userId } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if the user request already exists
    const existingRequest = group.userIds.find(
      (userRequest) => userRequest.userId.toString() === userId.toString()
    );

    if (existingRequest) {
      return res.status(400).json({ message: 'User request already exists' });
    }

    // Add the new user request
    group.userIds.push({
      userId,
      status: 'pending',
    });

    await group.save();

    // Notify admin
    const admin = await User.findOne({ isAdmin: true });
    if (admin) {
      const notification = new Notification({
        userId: admin._id,
        groupId,
        requestUserId: userId,
        message: `User ${userId} has requested to join the group ${groupId}. Please review their request.`,
      });
      await notification.save();
    }

    res.status(200).json({ message: 'User request added and admin notified' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};








const generateReferralCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let referralCode = '';
  for (let i = 0; i < 6; i++) {
    referralCode += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return referralCode;
};

// Create or update group with a referral code

exports.generateReferalCode = async (req, res) => {

  try {
    const newReferralCode = generateReferralCode();
   return res.status(200).json({ message: "Referral Code Generated", referralCode: newReferralCode });
  } catch (error) {
    console.error("Error generating referral code:", error);
    res.status(500).json({ message: error.message });
  }
};
exports.joinGroupByReferralCode = async (req, res) => {
  const { referralCode, userId } = req.body;
  try {
    // Check if the referral code matches for the given group ID
    const group = await Group.findOne({referralCode: referralCode });
    if (!group) {
      return res.status(404).json({ message: "Invalid referral code or group not found" });
    }

    // Check if the user is already a member or has a pending request
    const existingRequest = group.userIds.find(
      (userRequest) => userRequest?.userId?.toString() === userId?.toString()
    );

    if (existingRequest) {
      return res.status(400).json({ message: 'User already has a pending request or is a member' });
    }

    // Add the user to the group with an approved status
    group.userIds.push({
      userId,
      status: 'approved'
    });

    await group.save();
    const notification = new NotificationSchema({
      userId: userId,
      groupId: group._id,
      type: 'group',
      message: `You have joined the group: ${group.name}`,
    });
    await notification.save();

    res.status(200).json({ message: "User successfully joined the group" });
  } catch (error) {
    console.error("Error joining group by referral code:", error);
    res.status(500).json({ message: error.message });
  }
};
exports.getGroupDetails = async (req, res) => {
  const groupId = req.params.groupId;

  try {
    const group = await Group.findById(groupId)
      .populate('userId')  // Populate userId field
      .populate('groupInterestId')
      .populate('groupFrequencyId'); 

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    res.status(200).json({
      data: group,
      members: group.userIds.length,
    });
  } catch (error) {
    console.error("Error fetching group details:", error);
    res.status(500).json({ error: "Failed to fetch group details" });
  }
};



// Function to get eligible users and winners
exports.getEligibleUsersAndWinners = async (req, res) => {
  try {
    const groupId = req.params.groupId;

    // Fetch the group by ID and populate userIds
    const group = await Group.findById(groupId).populate({
      path: 'userIds.userId', // Populate the userId field in the userIds array
      select: 'fullname' // Select only the fields you want, e.g., fullName
    });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Get userIds with status "approved" and include full names
    const eligibleUsers = group?.userIds
      .filter(user => user.status === 'approved' && user?.userId) // Ensure userId is populated and status is approved
      .map(user => ({
        userId: user.userId._id, // Get the userId (assumes userId is populated)
        fullName: user.userId.fullname // Get the fullName from populated data
      }));

    // Get previous winners from the group
    const winners = group.winners || []; // Winners should be stored in the group

    // Filter eligible users by excluding those who are already winners
    const eligibleUsersFiltered = eligibleUsers.filter(eligibleUser => 
      !winners.some(winner => winner.userId.toString() === eligibleUser.userId.toString())
    );

    // Return the eligible users and winners
    res.status(200).json({
      eligibleUsers: eligibleUsersFiltered,
      winners
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//perform spin the wheel
exports.performSpin = async (req, res) => {
  try {
    const { groupId, userId } = req.params; // Extract groupId and userId from the request parameters

    // Fetch the group by ID and populate userId in userIds
    const group = await Group.findById(groupId).populate({
      path: 'userIds.userId', // Populate userId field in userIds
      select: 'fullname' // Select only the fullName field
    });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if the current user is either the group creator or in userIds with approved status
    const isGroupCreator = group?.userId?.toString() === userId;
    const isApprovedUser = group?.userIds?.some(user => 
      user?.userId && user?.userId?._id?.toString() === userId && user?.status === 'approved'
    );

    if (!isGroupCreator && !isApprovedUser) {
      return res.status(403).json({ message: "You are not allowed to perform the spin." });
    }

    // Get userIds with status "approved"
    const approvedUsers = group.userIds
      .filter(user => user.status === 'approved')
      .map(user => user.userId)
      .filter(Boolean); // Ensure valid userIds

    // Get previous winners from the group or initialize if not present
    let winners = group.winners || [];

    // Check if the current user has already won
    const hasUserAlreadyWon = winners.some(winner => winner?.userId.toString() === userId);

    if (hasUserAlreadyWon) {
      return res.status(403).json({ message: "You have already won and cannot spin again." });
    }

    // Exclude previous winners from eligible users
    const eligibleUsers = approvedUsers.filter(user => 
      !winners.some(winner => winner?.userId.toString() === user?._id?.toString())
    );

    // Check if there are any eligible users left
    if (eligibleUsers?.length === 0) {
      return res.status(200).json({ message: "No eligible users left to spin." });
    }

    // Select one random user for the spin
    const randomIndex = Math.floor(Math.random() * eligibleUsers?.length);
    const selectedUser = eligibleUsers[randomIndex];

    // Assign winner number based on the number of users already in the winners list
    const winnerNumber = winners?.length + 1;

    // Add the selected user to the winners list and assign them the winner number
    winners.push({ userId: selectedUser?._id, fullName: selectedUser?.fullname, winnerNumber });

    // Save the updated group with the new winner
    group.winners = winners;
    await group.save();

      //save the notification start
      const approvedUserIds = group.userIds
      .filter(item => item?.status === 'approved')
      .map(item => item?.userId);

    const userNotifications = approvedUserIds.map(userId => ({
      userId,
      groupId: group?._id,
      type: 'group',
      message: `${selectedUser?.fullname} is the new host of ${group.name}`,
    }));
    const allNotifications = [...userNotifications];

    // Insert all notifications into the database
    await NotificationSchema.insertMany(allNotifications);
    
  //notification done


    // Return the spin result including the selected user's full name
    res.status(200).json({
      message: "Spin completed successfully",
      spinResult: { 
        winnerUserId: selectedUser?._id, 
        fullName: selectedUser?.fullname, 
        winnerNumber 
      },
      allWinners: winners
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


