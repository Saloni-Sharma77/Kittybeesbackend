const dotenv = require("dotenv");
dotenv.config();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const UsersModel = require("../../schema/userSchema");
const GroupModel = require("../../schema/groupSchema");
const KittyModel = require("../../schema/kittySchema");

const VenueModel = require("../../schema/venueSchema");
const jwt = require("jsonwebtoken");
const kittySchema = require("../../schema/kittySchema");


exports.signup = async (req, res) => {
    const { email, password, fullname } = req.body;
    try {
      const existingUser = await UsersModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
      }
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = new UsersModel({
        fullname,
        email,
        password: hashedPassword,
      });
  
      const savedUser = await newUser.save();
      res.status(201).json({ loginid: savedUser._id, email: savedUser.email,message:'Registered Successfully', name:savedUser.fullname, });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
};
  exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await UsersModel.findOne({ email });
   
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
   
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.json({
        message: "Login successfull",
        token: token,
        loginid: user._id,
        user,
      });
    } catch (err) {
      res.status(500).json({ error: "Error logging in",error:err });
    }
  };
  exports.getAllUsersList = async (req, res) => {
    try {
      const { fullname } = req.query; // Get the search term from the query parameters

      const query = fullname ? { fullname: { $regex: fullname, $options: "i" } } : {};
      let getAllUsers = await UsersModel.find(query).sort({ createdAt: -1 });
      getAllUsers = getAllUsers.filter((item)=> item?.role !== 'admin')
      res.status(200).json({ 
        message: "User information retrieved successfully", 
        data: getAllUsers 
        
      });
    } catch (err) {
      res.status(500).json({
        error: "Failed to get information",
        details: err.message,
      });
    }
  };

  exports.getCountOfKittyAndGroupByme = async (req, res) => {
    try {
      const userId = req.params.userId;
      const groupCount = await GroupModel.find({ userId });
      const kittyCount = await KittyModel.find({ userId });
      const joinedGroupsCount = await GroupModel.find({
        'userIds.userId': userId,
        'userIds.status': 'approved',
      })
      res.status(200).json({
        success: true,
        groupCount,
        kittyCount,
        joinedGroupsCount
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Something went wrong',
        error: error.message,
      });
    }
  };
  


  exports.getuserById = async(req,res)=>{
    const userId = req.params.id; // Capture the ID from request parameters

  try {
    // Fetch user by ID from the database
    const user = await UsersModel.findById(userId);

    if (!user) {
      // If user not found, send a 404 response
      return res.status(404).json({
        error: "Data not found"
      });
    }

    // Send the user data with a 200 status code
    res.status(200).json({
      message: "User information retrieved successfully",
      data: user
    });
  } catch (err) {
    // Handle errors that occur during the database query
    res.status(500).json({
      error: "Failed to get user information",
      details: err.message
    });
  }
  }

  exports.updateUserInfo = async (req, res) => {
    const userId = req.params.id; // Capture the ID from request parameters
  
    // Capture the updated user information from the request body
    const {
      fullname,
      dob,
      phoneNumber,
      profession,
      email,
      emergencyNumber,
      specificintrests,
      eventArr,
      partyArr,
      activityArr,
      username,
      about,
      sociallinks,
    } = req.body;
  
    console.log(req.body, "response");
  
    try {
      // Find the user by ID and update with new information
      const updatedUser = await UsersModel.findByIdAndUpdate(
        userId,
        {
          fullname,
          dob,
          phoneNumber,
          profession,
          email,
          emergencyNumber,
          specificintrests,
          eventArr,
          partyArr,
          activityArr,
          username,
          about,
          sociallinks,
        },
        { new: true, runValidators: true } // Return the updated document
      );
  
      if (!updatedUser) {
        // If user not found, send a 404 response
        return res.status(404).json({
          error: "Data not found",
        });
      }
     
  
      // Send the updated user data with a 200 status code
      res.status(200).json({
        message: "Data updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      console.error("Error updating data", error);
      res.status(500).json({
        error: "Failed to update user information",
        details: error.message,
      });
    }
  };

  exports.deleteUserById = async (req, res) => {
    const userId = req.params.id; // Capture the ID from request parameters
  console.log(userId);
    try {
      // Find the user by ID and delete
      const deletedUser = await UsersModel.findByIdAndDelete(userId);
  
      if (!deletedUser) {
        // If user not found, send a 404 response
        return res.status(404).json({
          error: "User not found",
        });
      }
  
      // Send a success message with a 200 status code
      res.status(200).json({
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({
        error: "Failed to delete user",
        details: error.message,
      });
    }
  };

  exports.updateStatus = async (req, res)=>{
    const userId = req.params.id; // Capture the ID from request parameters
    const {
      isActive
    } = req.body;
  
    console.log(req.body, "response");
  
    try {
      const updatedUser = await UsersModel.findByIdAndUpdate(
        userId,
        {
          isActive
        },
        { new: true, runValidators: true } 
      );
  
      if (!updatedUser) {
        return res.status(404).json({
          error: "Data not found",
        });
      }
  
      // Send the updated user data with a 200 status code
      res.status(200).json({
        message: "Data updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      console.error("Error updating data", error);
      res.status(500).json({
        error: "Failed to update user information",
        details: error.message,
      });
    }
  }
  


  exports.getUserKittyVenueGroupCount = async (req, res) => {
    try {
      const getAllUsers = await UsersModel.find();
      const getAllGroups = await GroupModel.find();
      const getAllVenuues = await VenueModel.find();
      const getAllKittys = await kittySchema.find();
      res.status(200).json({ 
        message: "User information retrieved successfully", 
        user: getAllUsers.length,
        group: getAllGroups.length,
        venue: getAllVenuues.length,
        kitty: getAllKittys.length
        
      });
    } catch (err) {
      res.status(500).json({
        error: "Failed to get information",
        details: err.message,
      });
    }
  };


  
// exports.updateUserImage = async (req, res) => {
//   const { userId }  = req.params;
//   const { image } = req.body;

//   try {
//     const user = await UsersModel.findByIdAndUpdate(userId, { image }, { new: true });
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }
//     res.status(200).json({ message: 'Profile image updated successfully', data: user });
//   } catch (error) {
//     console.error('Error updating profile image:', error);
//     res.status(500).json({ error: 'Failed to update profile image', details: error.message });
//   }
// };



exports.updateUserImage = async (req, res) => {
  const { id } = req.params; // change userId to id
  const { image } = req.body;

  if (!id || !image) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  try {
    const user = await UsersModel.findByIdAndUpdate(id, { image }, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'Data updated successfully', data: user });
  } catch (error) {
    console.error('Error updating data', error);
    res.status(500).json({ error: 'Failed to update profile image', details: error.message });
  }
};


