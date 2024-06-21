const Group = require("../../schema/groupSchema");

exports.addGroup = async (req, res) => {
  try {
    const {
        name ,
        userIds,
        groupIcon ,
        groupType,
        description,
      rulesAndRegulation,
      kittyFrequency,
      groupCityArea,
      contributionAmount,
      groupMembers,
     
    } = req.body;

    const newGroup= new Group({
        name ,
        userIds,
        groupIcon ,
        groupType,
        description,
      rulesAndRegulation,
      kittyFrequency,
      groupCityArea,
      contributionAmount,
      groupMembers,
     
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
    const getAllGroup = await Group.find() ;
   
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
        userIds,
        description,
      rulesAndRegulation,
      kittyFrequency,
      groupCityArea,
      contributionAmount,
      groupMembers} = req.body;
    const updatedGroup = await Group.findByIdAndUpdate(
      req.params.id,
    {
        name ,
        userIds,
        groupIcon ,
        groupType,
        description,
      rulesAndRegulation,
      kittyFrequency,
      groupCityArea,
      contributionAmount,
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













