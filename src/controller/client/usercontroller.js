const dotenv = require("dotenv");
const { exec } = require('child_process');

dotenv.config();
const UsersModel = require("../../schema/userSchema");
// import { Request, Response } from 'express';

// Ensure bodyParser middleware is used to parse form data

exports.checkGender = async (req, res) => {
  const base64Image = req.body.base64Image;

  // Validate base64Image is provided
  if (!base64Image) {
      return res.status(400).send('Base64 image is required');
  }

  // Construct the command to execute the Python script
  const command = `python object_detection.py "${base64Image}"`;

  console.log(`Executing command: ${command}`);

  // Execute the command
  exec(command, (error, stdout, stderr) => {
      if (error) {
          console.error(`Error: ${error.message}`);
          return res.status(500).send('An error occurred while detecting gender');
      }
      if (stderr) {
          console.error(`Stderr: ${stderr}`);
          return res.status(500).send('An error occurred while detecting gender');
      }

      console.log(`Python script output: ${stdout}`);

      // Assuming stdout contains the result from the Python script
      res.send(stdout.trim());
  });
};



exports.adduserInfo = async (req, res) => {
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
    location
    
  } = req.body;

  console.log(req.body, "response");


  try {

    const existingUser = await UsersModel.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ error: "Phone number already exists" });
    }

    // Check if phoneNumber and emergencyNumber are the same
    if (phoneNumber == emergencyNumber) {
      return res.status(400).json({ error: "Phone number and emergency contact number cannot be the same" });
    }

    const newUser = new UsersModel({
      fullname,
      dob,
      phoneNumber,
      profession,
      email,
      eventArr,
      partyArr,
      activityArr,
      emergencyNumber,
      specificintrests,
      username,
      about,
      sociallinks,
      location
      
    });
    await newUser.save();
    res
      .status(201)
      .json({ message: "user Information  added successfully", data: newUser });
  } catch (error) {
    console.error("Error adding basic information:", error);
    res
      .status(500)
      .json({
        error: "Failed to add basic information",
        details: error.message,
      });
  }
};


exports.updateUserInfo = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  if (req.body.emergencyNumber && phoneNumber == req.body.emergencyNumber) {
    return res.status(400).json({ error: "Phone number and emergency contact number cannot be the same" });
  }


  const updateData = {};

  // Dynamically add fields to the update object if they are present in the request body
  if (req.body.fullname) updateData.fullname = req.body.fullname;
  if (req.body.dob) updateData.dob = req.body.dob;
  if (req.body.profession) updateData.profession = req.body.profession;
  if (req.body.email) updateData.email = req.body.email;
  if (req.body.emergencyNumber) updateData.emergencyNumber = req.body.emergencyNumber;
  if (req.body.specificintrests) updateData.specificintrests = req.body.specificintrests;
  if (req.body.eventArr) updateData.eventArr = req.body.eventArr;
  if (req.body.partyArr) updateData.partyArr = req.body.partyArr;
  if (req.body.activityArr) updateData.activityArr = req.body.activityArr;
  if (req.body.username) updateData.username = req.body.username;
  if (req.body.about) updateData.about = req.body.about;
  if (req.body.sociallinks) updateData.sociallinks = req.body.sociallinks;
  if (req.body.profileImage) updateData.profileImage = req.body.profileImage;
  if (req.body.location) updateData.location = req.body.location;
  if (req.body.verifiedBy) updateData.verifiedBy = req.body.verifiedBy;


  try {
    const updatedUser = await UsersModel.findOneAndUpdate(
      { phoneNumber }, // Find user by phone number
      { $set: updateData }, // Update only the fields that are present in updateData
      { new: true, upsert: false } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User information updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user information:", error);
    res.status(500).json({
      error: "Failed to update user information",
      details: error.message,
    });
  }
};

exports.getUserDetailByMobileNumber = async (req, res) => {
  const numbercheck = req.params.phoneNumber;

  try {
    const user = await UsersModel.findOne({ phoneNumber: numbercheck });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by phone number:", error);
    res.status(500).json({ error: "Failed to fetch user by phone number" });
  }
};















