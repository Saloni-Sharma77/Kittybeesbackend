const Kitty = require('../../schema/kittySchema');
const VenueReviewSchema = require('../../schema/venueReviewSchema');
const NotificationSchema = require('../../schema/notificationSchema');
const UserSchema = require('../../schema/userSchema');
const GroupSchema = require('../../schema/groupSchema');




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
      venuepoll
    } = req.body;

    // Validation checks
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: "Name is required and must be a string" });
    }
    if (!groupId || !mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ error: "Invalid groupId" });
    }
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }
    if (!date || isNaN(new Date(date).getTime())) {
      return res.status(400).json({ error: "Invalid date" });
    }
    if (!time || typeof time !== 'string') {
      return res.status(400).json({ error: "Time is required and must be a string" });
    }
    if (theamepoll && (!theamepoll.question || !Array.isArray(theamepoll.options))) {
      return res.status(400).json({ error: "Theame poll question is required and options must be an array" });
    }
    if (locationpoll && (!locationpoll.question || !Array.isArray(locationpoll.options))) {
      return res.status(400).json({ error: "Location poll question is required and options must be an array" });
    }
    if (venuepoll && (!venuepoll.question || !Array.isArray(venuepoll.options))) {
      return res.status(400).json({ error: "Venue poll question is required and options must be an array" });
    }

    // Validate and structure the poll data
    const theamePollData = theamepoll ? {
      question: theamepoll.question,
      options: theamepoll.options.map(option => ({
        optionText: option.optionText,
        votes: option.votes || 0  // Default to 0 if not provided
      })),
      type: 'theampolls'
    } : null;

    const locationPollData = locationpoll ? {
      question: locationpoll.question,
      options: locationpoll.options.map(option => ({
        optionText: option.optionText,
        votes: option.votes || 0
      })),
      type: 'locationpolls'
    } : null;

    const venuePollData = venuepoll ? {
      question: venuepoll.question,
      options: venuepoll.options.map(option => ({
        optionText: option.optionText,
        votes: option.votes || 0
      })),
      type: 'venuepolls'
    } : null;

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

    // Send success response
    res.status(201).json({ message: "Kitty added successfully", data: newKitty });
  } catch (err) {
    console.error("Error adding kitty", err);
    res.status(500).json({ error: "Failed to add kitty" });
  }
};

exports.getAllKittys = async (req, res) => {
  try {
    const getAllKitty = await Kitty.find()
      .populate({
        path: 'groupId',
        populate: {
          path: 'userId',
          model: 'Users' 
        }
      })
      .populate('userId')
      .populate('venueId')


      .sort({ createdAt: -1 });

    res.status(200).json({ message: "Data fetched successfully", data: getAllKitty });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.getAllPastAndFutureKitties = async (req, res) => {
  try {
    const { type } = req.query; // Fetch type parameter
    const today = new Date(); // Current date in JavaScript

    // Function to convert 'DD/MM/YYYY' or 'DD-MM-YYYY' to a Date object
    const convertToDate = (str) => {
      const [day, month, year] = str.split(/[\/-]/).map(Number); // Split by '/' or '-' and extract day, month, year
      return new Date(year, month - 1, day); // Create a JavaScript Date object
    };

    // Function to get start and end of the day
    const getStartOfDay = () => new Date(today.setHours(0, 0, 0, 0));
    const getEndOfDay = () => new Date(today.setHours(23, 59, 59, 999));

    // Define filter object
    let filter = {};

    // Check the type of kitties to filter
    if (type === 'past') {
      filter = {
        $expr: {
          $lt: [{ $dateFromString: { dateString: "$date", format: "%d/%m/%Y" } }, today]
        }
      };
    } else if (type === 'present') {
      const startOfDay = getStartOfDay();
      const endOfDay = getEndOfDay();

      filter = {
        $expr: {
          $and: [
            { $gte: [{ $dateFromString: { dateString: "$date", format: "%d/%m/%Y" } }, startOfDay] },
            { $lte: [{ $dateFromString: { dateString: "$date", format: "%d/%m/%Y" } }, endOfDay] }
          ]
        }
      };
    } else if (type === 'future') {
      filter = {
        $expr: {
          $gt: [{ $dateFromString: { dateString: "$date", format: "%d/%m/%Y" } }, today]
        }
      };
    }

    // Fetch kitties based on the filter
    const getAllKitty = await Kitty.find(filter)
      .populate({
        path: 'groupId',
        populate: {
          path: 'userId',
          model: 'Users'
        }
      })
      .populate('userId')
      .populate('venueId')
      .populate('themeId')
      .populate('colorId')
      
      .sort({ createdAt: -1 });

    res.status(200).json({ message: "Data fetched successfully", data: getAllKitty });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};



exports.joinKitty = async (req, res) => {
  try {
    const { kittyId, requestUserId, status } = req.body;

    // Find the kitty by ID
    const kitty = await Kitty.findById(kittyId);

    if (!kitty) {
      return res.status(404).json({ message: 'Kitty not found' });
    }

    // Check if the user is already in the members array
    const existingMemberIndex = kitty.members.findIndex(member => 
      member.userId && member.userId.toString() === requestUserId
    );

    if (existingMemberIndex !== -1) {
      // User is already a member, update their status
      kitty.members[existingMemberIndex].status = status;
    } else {
      // User is not a member, add them to the members array
      const newMember = {
        userId: requestUserId,
        status: status // Set the status
      };
      kitty.members.push(newMember); // Push the new member to the array
    }

    // Save the updated kitty document
    const updatedKitty = await kitty.save();

    return res.status(200).json({ message: 'Member status updated successfully', updatedKitty });

  } catch (error) {
    console.log('the error is', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }

};



exports.acceptOrRejectRequestOfKitty = async (req, res)=>{
  try {
    const { notificationId, status } = req.body;

    const kitty = await NotificationSchema.findById(notificationId).populate('userId').populate('kittyId');    
    const kittyId = kitty?.kittyId?._id
   let findWhichKitty = await Kitty.findById(kittyId);
   const memberExists = findWhichKitty.members.some(member => member.userId.toString() === requestUserId.toString());


  if(status === 'approved' && !memberExists){
    findWhichKitty?.members.push({
       userId: kittyId?.requestUserId, 
       status:status || 'approved'
    })
  } 

  await findWhichKitty.save();

  console.log(findWhichKitty,'ddddddddddd')


  //  return

  //   // Create a notification for the kitty creator
    const notification = new NotificationSchema({
      userId: userId, // Kitty creator
      // groupId: kitty.groupId, // Assuming groupId is part of the kitty
      kittyId: kittyId,
      requestUserId: requestUserId, // User who sent the request
      message: message || `${requestedUser?.fullname}  your request has been accepted for the kitty ${kitty?.name}.`,
    });

    // Save the notification
    await notification.save();

    res.status(200).json({ message: `Request ${status}` });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }


}


exports.addKittyMemories = async (req,res)=>{
  try {
    const { kittyId,image, userId } = req.body;

    // Find the kitty by ID
    const kitty = await Kitty.findById(kittyId);

    if (!kitty) {
      return res.status(404).json({ message: 'Kitty not found' });
    }
   const  getGroupId =  kitty?.groupId[0]?._id

     let groupdata = await GroupSchema.find(getGroupId)



    // Add the new memory to the groupMemories array
    groupdata.groupMemories.push({
      image:image,
      userId: userId // userId from the request body
    });

    // Save the updated group document
    await group.save();

    res.status(200).json({ message: 'Memory added successfully', group });
  } catch (error) {
    res.status(500).json({ message: 'Error adding memory', error });
  }

}



exports.getKittyById = async (req, res) => {
  const kittyId = req.params.id; // Capture the ID from request parameters

  try {
    const getKitty = await Kitty.findById(kittyId)
      .populate({
        path: 'groupId',
        populate: {
          path: 'userId',
          model: 'Users'
        }
      })
      .populate('userId')
      .populate('members.userId')
      .populate('themeId')
      .populate('venueId')
      .populate('colorId')
      .populate('activityId')
      .populate('templateId')


    if (!getKitty) {
      return res.status(404).json({ error: "Kitty not found" });
    }

    let venueRev = await VenueReviewSchema.find({ venueId: getKitty?.venueId });
    res.status(200).json({ message: "Kitty fetched successfully", data: getKitty,Venuereviews : venueRev?.length || 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

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
    res.status(500).json({ error: "Failed to delete Kitty", details: error.message });
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

    res.status(200).json({ message: "Data updated successfully", data: updatedKitty });
  } catch (error) {
    console.error("Error updating data", error);
    res.status(500).json({ error: "Failed to update data", details: error.message });
  }
};





