const Group = require("../../schema/groupSchema");
const GroupCategoryModel = require("../../schema/groupCategorySchema");
const GroupInterestModel = require("../../schema/groupInterestSchema");
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
//group Category
exports.addGroupCategory = async (req, res) => {
  try {
    const {
        name ,
    } = req.body;
    const newGroupCat= new GroupCategoryModel({
        name ,
    });

    await newGroupCat.save();

    res.status(201).json({ message: "Group Category added successfully", task: newGroupCat });
  } catch (err) {
    res.status(500).json({ error: "Failed to add GroupCategory" });
  }
};
exports.getAllGroupsCategory = async (req, res) => {
  try {
    const getAllGroupCat = await GroupCategoryModel.find().sort({ createdAt: -1 }) ;
   
    res
      .status(200)
      .json({ message: "Group Category List fetched successfully", data: getAllGroupCat });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getGroupCategoryById = async (req, res) => {
  const groupcatId = req.params.id;

  try {
    const groupc = await GroupCategoryModel.findById(groupcatId);
    if (!groupc) {
      return res.status(404).json({ error: "Request not found" });
    }

    res.status(200).json(groupc);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user by ID" });
  }
};

exports.updateCategoryGroup = async (req, res) => {
  try {
    const {
        name ,
      } = req.body;
    const updatedcatGroup = await GroupCategoryModel.findByIdAndUpdate(
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
exports.deleteCategoryGroup = async (req, res) => {
  try {
    const deletedgroupcat = await GroupCategoryModel.findByIdAndDelete(req.params.id);
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


















