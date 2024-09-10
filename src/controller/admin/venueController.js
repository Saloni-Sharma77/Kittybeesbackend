const Venue = require("../../schema/venueSchema");

exports.addVenue = async (req, res) => {
  try {
    const {
        name ,
        userId,
        location,
        venueCatId,
        lat,
        long,
        image,
        pricing,
        contactNo,
    } = req.body;

    const newVenue= new Venue({
        name,
        location,
        userId,
        venueCatId,
        lat,
        long,
        image,
        pricing,
        contactNo,
    });

    await newVenue.save();

    res.status(201).json({ message: "Data added successfully", task: newVenue });
  } catch (err) {
    console.error("Error adding task:", err);
    res.status(500).json({ error: "Failed to add data" });

  }
};


exports.getAllVenues = async (req, res) => {
  try {
    const { name, page = 1, limit = 10 } = req.query; // Get the search term and pagination parameters from the query

    // Convert page and limit to integers
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    // Validate page and limit values
    if (pageNumber < 1 || pageSize < 1) {
      return res.status(400).json({ message: "Invalid page or limit value" });
    }

    const query = name ? { name: { $regex: name, $options: "i" } } : {};

    // Get the total number of documents that match the query
    const totalDocuments = await Venue.countDocuments(query);

    // Fetch the paginated data
    const venues = await Venue.find(query)
      .populate('venueCatId')
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * pageSize) // Skip the documents for previous pages
      .limit(pageSize); // Limit the number of documents returned

    // Calculate total pages
    const totalPages = Math.ceil(totalDocuments / pageSize);

    res.status(200).json({
      message: "Data fetched successfully",
      data: venues,
      pagination: {
        totalDocuments,
        totalPages,
        currentPage: pageNumber,
        pageSize
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.getAllCities = async (req, res) => {
  try {
  
    const getAllCity = await Venue.find();
   
    res
      .status(200)
      .json({ message: "Data fetched successfully", data: getAllCity });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
//

// Helper function to calculate distance between two coordinates
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Radius of Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

exports.getFilteredVenues = async (req, res) => {
  try {
    const { city, venueType, priceMin, priceMax, distance, lat, long, sortByKittyParties } = req.query;

    // Build the query object dynamically
    const query = {};

    // Filter by city if provided
    if (city) {
      query['location.city'] = city;
    }

    // Filter by venue type
    if (venueType) {
      query['type'] = venueType;
    }

    // Filter by price range
    if (priceMin || priceMax) {
      query['pricing'] = {};
      if (priceMin) {
        query['pricing']['$gte'] = priceMin;
      }
      if (priceMax) {
        query['pricing']['$lte'] = priceMax;
      }
    }

    // Fetch venues from the database
    let venues = await Venue.find(query);

    // Filter by distance if lat and long are provided
    if (lat && long && distance) {
      venues = venues.filter(venue => {
        const venueDistance = haversineDistance(lat, long, venue.lat, venue.long);
        return venueDistance <= distance;
      });
    }

    // Sort by number of kitty parties if requested
    if (sortByKittyParties) {
      venues.sort((a, b) => b.kittyPartiesCount - a.kittyPartiesCount);
    }

    res.status(200).json({ venues });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching venues', error });
  }
};

//



exports.getAllVenuesHostedbyMe = async (req, res) => {
  try {
    const userId  = req.params.id;

    const getAllVenue = await Venue.find({ userId: userId }).sort({ createdAt: -1 }) ;
   
    res
      .status(200)
      .json({ message: "Data fetched successfully", data: getAllVenue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getVenueById = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await Venue.findById(id);
    if (!user) {
      return res.status(404).json({ error: "Request not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching Venue Request by ID:", error);
    res.status(500).json({ error: "Failed to fetch user by ID" });
  }
};
exports.updateVenue = async (req, res) => {
  try {
    const {
        name ,
        venueCatId,

        userId,
        location,
        lat,
        long,
        image,
        pricing,
        contactNo,
      VenueMembers} = req.body;
    const updatedVenue = await Venue.findByIdAndUpdate(
      req.params.id,
    {
        name ,
        userId,
        venueCatId,

        location,
        lat,
        long,
        image,
        pricing,
        contactNo,

    },
      { new: true }
    );
    if (!updatedVenue) {
      return res.status(404).json({ error: "Venue not found" });
    }
    res.status(200).json(updatedVenue);
  } catch (err) {
    console.error("Error updating Venue:", err);
    res.status(500).json({ error: "Failed to update Venue" });
  }
};
exports.deleteVenue = async (req, res) => {
  try {
    const deletedVenue = await Venue.findByIdAndDelete(req.params.id);
    if (!deletedVenue) {
      return res.status(404).json({ error: "Data not found" });
    }
    res.status(200).json({ message: "Data deleted successfully" });
  } catch (err) {
    console.error("Error deleting Venue:", err);
    res.status(500).json({ error: "Failed to delete Venue" });
  }
};

exports.updateStatus = async (req, res)=>{
  const venueId = req.params.id; // Capture the ID from request parameters
  const {
    isActive
  } = req.body;

  console.log(req.body, "response");

  try {
    const updatedVenue = await Venue.findByIdAndUpdate(
      venueId,
      {
        isActive
      },
      { new: true, runValidators: true } 
    );

    if (!updatedVenue) {
      return res.status(404).json({
        error: "Venue not found",
      });
    }

    // Send the updated user data with a 200 status code
    res.status(200).json({
      message: "Venue information updated successfully",
      data: updatedVenue,
    });
  } catch (error) {
    console.error("Error updating venue information:", error);
    res.status(500).json({
      error: "Failed to update venue information",
      details: error.message,
    });
  }
}













