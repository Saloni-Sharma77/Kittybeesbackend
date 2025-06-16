
const ActivityModel = require("../../schema/activitySchema");
const mongoose =require('mongoose')
exports.addActivity = async (req, res) => {
  try {
      const { name ,description,userId,createdBy,icon} = req.body;
      const newActivity = new ActivityModel({
          name,
          description,
          userId,
          createdBy,
          updatedBy,
          icon
      });

      await newActivity.save();

      res.status(201).json(newActivity);
  } catch (error) {
      console.error('Error adding Activity:', error);
      res.status(500).json({ error: 'Failed to add Activity' });
  }
};

 
exports.updateActivity = async (req, res) => {
  try {
      const { id } = req.params;
      const { name,description ,userId,createdBy,updatedBy,icon} = req.body;

      const updatedActivity = await ActivityModel.findByIdAndUpdate(
          id,
          { name,description,userId,createdBy ,updatedBy,icon},
          { new: true, runValidators: true }
      );

      if (!updatedActivity) {
          return res.status(404).json({ error: 'Activity not found' });
      }

      res.json(updatedActivity);
  } catch (error) {
      console.error('Error updating Activity:', error);
      res.status(500).json({ error: 'Failed to update Activity' });
  }
};


  exports.getActivityById = async (req, res) => {
    try {
        const { id } = req.params;
  
        const Activity = await ActivityModel.findById(id);
  
        if (!Activity) {
            return res.status(404).json({ error: 'Activity not found' });
        }
  
        res.json(Activity);
    } catch (error) {
        console.error('Error fetching Activity:', error);
        res.status(500).json({ error: 'Failed to fetch Activity' });
    }
  };

  exports.getAllActivityOfUser = async (req, res) => {
    try {
      const userId = req.params.id; // Extract userId from request parameters
      const objectIdUserId = new mongoose.Types.ObjectId(userId);

      // Query to get activities created by admin
      const adminActivities = await ActivityModel.find({ createdBy: 'admin' ,isActive:true}).sort({ createdAt: -1 });
  
      // Query to get activities associated with the userId
      const userActivities = await ActivityModel.find({ userId: objectIdUserId ,isActive:true}).sort({ createdAt: -1 });
  
      // Combine both admin-created and user-specific activities
      const allActivities = [...adminActivities, ...userActivities];
  
      // Check if any activities were found
      if (allActivities.length === 0) {
        return res.status(404).json({
          message: "No activities found for this user or created by admin.",
        });
      }
  
      // Return success response with the retrieved activities
      res.status(200).json({
        message: "Activities retrieved successfully",
        data: { events: allActivities }, // Wrap activities in an events object
      });
    } catch (err) {
      // Handle errors and return a failure response
      res.status(500).json({
        error: "Failed to retrieve activities",
        details: err.message, // Include error details for debugging
      });
    }
  };
  

  
  exports.getAllActivity = async (req, res) => {
    try {

      const getAllActivity = await ActivityModel.find().populate('createdBy','fullname').populate('updatedBy','fullname').sort({ createdAt: -1 });
      res.status(200).json({ 
        message: "Activity retrieved successfully", 
        data: {events:getAllActivity} 
      });
    } catch (err) {
      res.status(500).json({
        error: "Failed to get information",
        details: err.message,
      });
    }
  };

  exports.deleteActivity = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedActivity = await ActivityModel.findByIdAndDelete(id);

        if (!deletedActivity) {
            return res.status(404).json({ error: 'Activity not found' });
        }

        res.status(200).json({message: 'Activity deleted successfully' });
    } catch (error) {
        console.error('Error deleting Activity:', error);
        res.status(500).json({ error: 'Failed to delete Activity' });
    }
};

exports.updateActivityStatus = async (req, res)=>{
  const ActivityId = req.params.id; // Capture the ID from request parameters
  const {
    isActive,
    createdBy,
    updatedBy,

  } = req.body;

  console.log(req.body, "response");

  try {
    const updatedActivity = await ActivityModel.findByIdAndUpdate(
      ActivityId,
      {
        isActive,
        createdBy,
    updatedBy,
      },
      { new: true, runValidators: true } 
    );

    if (!updatedActivity) {
      return res.status(404).json({
        error: "Activity not found",
      });
    }

    // Send the updated user data with a 200 status code
    res.status(200).json({
      message: "Activity information updated successfully",
      data: updatedActivity,
    });
  } catch (error) {
    console.error("Error updating Activity information:", error);
    res.status(500).json({
      error: "Failed to update Activity information",
      details: error.message,
    });
  }
}
