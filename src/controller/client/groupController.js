const Group = require("../../schema/groupSchema");
const mongoose = require("mongoose");

exports.addGroup = async (req, res) => {
  try {
    const {
        name ,
        userId,
        userIds,
        groupIcon ,
        groupType,
        description,
      rulesAndRegulation,
      kittyFrequency,
      groupCityArea,
      contributionAmount,
      groupMembers,
      image
     
    } = req.body;

    const newGroup= new Group({
        name ,
        userIds,
        userId,
        groupIcon ,
        groupType,
        description,
      rulesAndRegulation,
      kittyFrequency,
      groupCityArea,
      contributionAmount,
      groupMembers,
      image
     
    });

    await newGroup.save();

    res.status(201).json({ message: "Group added successfully", task: newGroup });
  } catch (err) {
    console.error("Error adding task:", err);
    res.status(500).json({ error: "Failed to add Group" });
  }
};
exports.getAllGroups = async (req, res) => {
  try {
    const getAllGroup = await Group.find().populate('userIds').sort({ createdAt: -1 }) ;
   
    res
      .status(200)
      .json({ message: "Group List fetched successfully", data: getAllGroup });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getGroupById = async (req, res) => {
  const groupId = req.params.id;

  try {
    const user = await Group.findById(groupId);
    if (!user) {
      return res.status(404).json({ error: "Request not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching Group Request by ID:", error);
    res.status(500).json({ error: "Failed to fetch user by ID" });
  }
};


exports.getGroupHostedByMe = async (req, res) => {
  try {
    const userId  = req.params.id;


    // Find groups where userId exactly matches the specified userId field
    const groups = await Group.find({ userId: userId });

    if (groups.length === 0) {
      return res.status(404).json({ message: "No groups found with this user ID as the main user." });
    }

    res.status(200).json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};







exports.updateGroup = async (req, res) => {
  try {
    const {
        name ,
        groupIcon ,
        groupType,
        useId,
        userIds,
        description,
      rulesAndRegulation,
      kittyFrequency,
      groupCityArea,
      contributionAmount,
      image,
      groupMembers} = req.body;
    const updatedGroup = await Group.findByIdAndUpdate(
      req.params.id,
    {
        name ,
        userIds,
        groupIcon ,
        useId,

        groupType,
        description,
      rulesAndRegulation,
      kittyFrequency,
      groupCityArea,
      contributionAmount,
      image,
      groupMembers,
    },
      { new: true }
    );
    if (!updatedGroup) {
      return res.status(404).json({ error: "Group not found" });
    }
    res.status(200).json(updatedGroup);
  } catch (err) {
    console.error("Error updating Group:", err);
    res.status(500).json({ error: "Failed to update Group" });
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

















