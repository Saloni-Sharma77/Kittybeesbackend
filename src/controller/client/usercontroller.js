const dotenv = require("dotenv");
dotenv.config();
const UsersModel = require("../../schema/userSchema");
// import { Request, Response } from 'express';

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
    
  } = req.body;

  console.log(req.body, "response");

  try {
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



exports.sendInterestAndPreference =async(req,res)=>{
  res.json({
    "events": [
        "Party",
        "Concert",
        "Festival",
        "Conference",
       
    ],
    "preferred_party": [
        "Dance",
        "Music",
        "Custom"
    ],
    "activities": [
        "Bowling",
        "Cricket",
        "Card Games",
        "Chess"
    ]
});
}




