
const NotificationSchema = require("../../schema/notificationSchema"); // Import Notification model


exports.getNotificationsOfUser = async (req, res) => {
    const { userId } = req.params;
  
    try {
      // Fetch notifications for the user with status 'approved'
      const notifications = await NotificationSchema.find({ userId })
        .sort({ createdAt: -1 }); // Sort by most recent first
  
      res.status(200).json({
        message: "Notifications fetched successfully",
        notifications,
      });
    } catch (err) {
      console.error("Error fetching notifications:", err);
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  };


  exports.deleteNotificationById = async (req, res) => {
    const { notificationId } = req.params; // Extract the notification ID from the request parameters
  
    try {
      // Ensure notificationId is provided
      if (!notificationId) {
        return res.status(400).json({ message: "Notification ID is required" });
      }
  
      // Find and delete the notification by its ID
      const deletedNotification = await NotificationSchema.findByIdAndDelete(notificationId);
  
      // Check if the notification was found and deleted
      if (!deletedNotification) {
        return res.status(404).json({ message: "Notification not found" });
      }
  
      // Return success response
      res.status(200).json({ message: "Notification deleted successfully", deletedNotification });
    } catch (error) {
      // Handle any errors
      console.error("Error deleting notification:", error);
      res.status(500).json({ message: "Failed to delete notification", error: error.message });
    }
  };
  