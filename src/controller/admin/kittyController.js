const Kitty = require('../../schema/kittySchema');

exports.addKitty = async (req, res) => {
  try {
    const {
      name,
      groupId,
      date,
      time,
      image,
      themeId,
      instructions,
      colorId,
      venueId,
      activityId,
      templateId,
      addressId,
      theamepoll,
      locationpoll,
      venuepoll
    } = req.body;

    const newKitty = new Kitty({
      name,
      groupId,
      date,
      time,
      image,
      themeId,
      addressId,
      instructions,
      colorId,
      venueId,
      activityId,
      templateId,
      theamepoll,
      locationpoll,
      venuepoll
    });

    await newKitty.save();
    res.status(201).json({ message: "Data added successfully", task: newKitty });
  } catch (err) {
    console.error("Error adding data", err);
    res.status(500).json({ error: "Failed to add data" });
  }
};

exports.getAllKittys = async (req, res) => {
  try {
    const getAllKitty = await Kitty.find()
      .populate({
        path: 'groupId',
        populate: {
          path: 'userId',
          model: 'Users' 
        }
      })
      .populate('userId')
      .populate('venueId')


      .sort({ createdAt: -1 });

    res.status(200).json({ message: "Data fetched successfully", data: getAllKitty });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.getAllPastAndFutureKitties = async (req, res) => {
  try {
    const { type } = req.query; // Fetch type parameter
    const today = new Date(); // Current date in JavaScript

    // Function to convert 'DD/MM/YYYY' or 'DD-MM-YYYY' to a Date object
    const convertToDate = (str) => {
      const [day, month, year] = str.split(/[\/-]/).map(Number); // Split by '/' or '-' and extract day, month, year
      return new Date(year, month - 1, day); // Create a JavaScript Date object
    };

    // Function to get start and end of the day
    const getStartOfDay = () => new Date(today.setHours(0, 0, 0, 0));
    const getEndOfDay = () => new Date(today.setHours(23, 59, 59, 999));

    // Define filter object
    let filter = {};

    // Check the type of kitties to filter
    if (type === 'past') {
      filter = {
        $expr: {
          $lt: [{ $dateFromString: { dateString: "$date", format: "%d/%m/%Y" } }, today]
        }
      };
    } else if (type === 'present') {
      const startOfDay = getStartOfDay();
      const endOfDay = getEndOfDay();

      filter = {
        $expr: {
          $and: [
            { $gte: [{ $dateFromString: { dateString: "$date", format: "%d/%m/%Y" } }, startOfDay] },
            { $lte: [{ $dateFromString: { dateString: "$date", format: "%d/%m/%Y" } }, endOfDay] }
          ]
        }
      };
    } else if (type === 'future') {
      filter = {
        $expr: {
          $gt: [{ $dateFromString: { dateString: "$date", format: "%d/%m/%Y" } }, today]
        }
      };
    }

    // Fetch kitties based on the filter
    const getAllKitty = await Kitty.find(filter)
      .populate({
        path: 'groupId',
        populate: {
          path: 'userId',
          model: 'Users'
        }
      })
      .populate('userId')
      .populate('venueId')

      .sort({ createdAt: -1 });

    res.status(200).json({ message: "Data fetched successfully", data: getAllKitty });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};




exports.getKittyById = async (req, res) => {
  const kittyId = req.params.id; // Capture the ID from request parameters
  console.log(kittyId);

  try {
    const getKitty = await Kitty.findById(kittyId)
      .populate({
        path: 'groupId',
        populate: {
          path: 'userId',
          model: 'Users'
        }
      })
      .populate('userId')
      .populate('themeId')
      .populate('venueId')
      .populate('colorId')
      .populate('activityId')
      .populate('templateId');

    if (!getKitty) {
      return res.status(404).json({ error: "Kitty not found" });
    }

    res.status(200).json({ message: "Kitty fetched successfully", data: getKitty });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteKittyById = async (req, res) => {
  const kittyId = req.params.id; // Capture the ID from request parameters
  console.log(kittyId);

  try {
    const deletedKitty = await Kitty.findByIdAndDelete(kittyId);

    if (!deletedKitty) {
      return res.status(404).json({ error: "Kitty not found" });
    }

    res.status(200).json({ message: "Kitty deleted successfully" });
  } catch (error) {
    console.error("Error deleting Kitty:", error);
    res.status(500).json({ error: "Failed to delete Kitty", details: error.message });
  }
};

exports.updateKittyStatus = async (req, res) => {
  const kittyId = req.params.id; // Capture the ID from request parameters
  const { isActive } = req.body;

  console.log(req.body, "response");

  try {
    const updatedKitty = await Kitty.findByIdAndUpdate(
      kittyId,
      { isActive },
      { new: true, runValidators: true }
    );

    if (!updatedKitty) {
      return res.status(404).json({ error: "Kitty not found" });
    }

    res.status(200).json({ message: "Data updated successfully", data: updatedKitty });
  } catch (error) {
    console.error("Error updating data", error);
    res.status(500).json({ error: "Failed to update data", details: error.message });
  }
};





