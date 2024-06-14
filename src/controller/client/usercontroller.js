const dotenv = require("dotenv");
dotenv.config();
const UsersModel = require("../../schema/userSchema");

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
