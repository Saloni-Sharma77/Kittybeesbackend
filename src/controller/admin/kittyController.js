const Kitty = require("../../schema/kittySchema");

exports.addKitty = async (req, res) => {
  try {
    const {
        name ,
        groupId,
      
     
    } = req.body;

    const newKitty= new Kitty({
        name ,
        groupId,
     
    });

    await newKitty.save();

    res.status(201).json({ message: "Data added successfully", task: newKitty });
  } catch (err) {
    console.error("Error adding data", err);
    res.status(500).json({ error: "Failed to add data" });
  }
};



exports.getAllKittys = async (req, res) => {
  try {
    const getAllKitty = await Kitty.find()
      .populate({
        path: 'groupId',
        populate: {
          path: 'userIds',
          model: 'Users' 
        }
      })
      .populate('userId') 
      .sort({ createdAt: -1 });

    res.status(200).json({ message: "Data fetched successfully", data: getAllKitty });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getKittyById = async (req, res) => {
    const KittyId = req.params.id; // Capture the ID from request parameters
    console.log(KittyId)

  try {
    const getKittyId = await Kitty.findById(KittyId)
      .populate({
        path: 'groupId',
        populate: {
          path: 'userIds',
          model: 'Users' 
        }
      })
      .populate('userId') 
      .sort({ createdAt: -1 });

    res.status(200).json({ message: "Kitty fetched successfully", data: getKittyId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};


// exports.getKittyById = async (req, res) => {

//   const KittyId = req.params.id; // Capture the ID from request parameters
//   console.log(KittyId);

//   try {
//     // Fetch kitty by ID from the database and populate groupId and userId
//     const kitty = await Kitty.findById(KittyId)
//     console.log(kitty)
//       .populate({
//         path: 'groupId',
//         populate: {
//           path: 'userIds',
//           model: 'Users' // Assuming 'User' is the model name for userIds
//         }
//       })
//       .populate('userId');

//     if (!kitty) {
//       // If kitty not found, send a 404 response
//       return res.status(404).json({ error: "Kitty not found" });
//     }

//     // Send the kitty data with a 200 status code
//     res.status(200).json({
//       message: "Kitty information retrieved successfully",
//       data: kitty
//     });
//   } catch (err) {
//    // Handle errors that occur during the database query
//    console.error(err);
//    res.status(500).json({
//      error: "Failed to get kitty information",
//      details: err.message
//    });
//   }
// };



exports.deleteKittyById = async (req, res) => {
  const kittyId = req.params.id; // Capture the ID from request parameters
console.log(kittyId);
  try {
    // Find the user by ID and delete
    const deletedKitty = await Kitty.findByIdAndDelete(kittyId);

    if (!deletedKitty) {
      // If user not found, send a 404 response
      return res.status(404).json({
        error: "Kitty not found",
      });
    }

    // Send a success message with a 200 status code
    res.status(200).json({
      message: "Kitty deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting Kitty:", error);
    res.status(500).json({
      error: "Failed to delete Kitty",
      details: error.message,
    });
  }
};

exports.updateKittyStatus = async (req, res)=>{
  const kittyId = req.params.id; // Capture the ID from request parameters
  const {
    isActive
  } = req.body;

  console.log(req.body, "response");

  try {
    const updatedKitty = await Kitty.findByIdAndUpdate(
      kittyId,
      {
        isActive
      },
      { new: true, runValidators: true } 
    );

    if (!updatedKitty) {
      return res.status(404).json({
        error: "Kitty not found",
      });
    }

    // Send the updated user data with a 200 status code
    res.status(200).json({
      message: "Data updated successfully",
      data: updatedKitty,
    });
  } catch (error) {
    console.error("Error updating data", error);
    res.status(500).json({
      error: "Failed to update data",
      details: error.message,
    });
  }
}