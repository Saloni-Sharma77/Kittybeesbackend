
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