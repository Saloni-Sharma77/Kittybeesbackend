const mongoose = require('mongoose'); // Ensure mongoose is imported
const City = require('../../schema/citySchema');
const VenueType = require('../../schema/typeofvanueSchema');
const Venue = require("../../schema/venueSchema");
const VenueReview = require('../../schema/venueReviewSchema'); // Ensure this import matches your path

// exports.addVenue = async (req, res) => {
//   try {
//     const {
//         name,
//         userId,
//         cityId,
//         venueTypeId,
//         venueCatId,
//         location,
//         lat,
//         long,
//         image,
//         pricing,
//         contactNo,
//         kittiesHappened,  // Add these fields
//         kittiesBooked     // Add these fields
//     } = req.body;

//     // Validation check for cityId and venueTypeId
//     if (!mongoose.Types.ObjectId.isValid(cityId) || !mongoose.Types.ObjectId.isValid(venueTypeId)) {
//         return res.status(400).json({ error: "Invalid cityId or venueTypeId" });
//     }

//     const newVenue = new Venue({
//         name,
//         userId,
//         cityId,
//         venueTypeId,
//         venueCatId,
//         location,
//         lat,
//         long,
//         image,
//         pricing,
//         contactNo,
//         kittiesHappened,   // Initialize here
//         kittiesBooked      // Initialize here
//     });

//     await newVenue.save();

//     res.status(201).json({ message: "Venue added successfully", venue: newVenue });
//   } catch (err) {
//     console.error("Error adding venue:", err);
//     res.status(500).json({ error: "Failed to add venue", details: err.message });
//   }
// };

exports.addVenue = async (req, res) => {
  try {
    const {
      name,
      userId,
      cityId,
      venueTypeId,
      venueCatId,
      location,
      lat,
      long,
      image,
      pricing,
      contactNo,
      kittiesHappened,
      kittiesBooked
    } = req.body;

    // Validation checks
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: "Name is required and must be a string" });
    }
    if (!mongoose.Types.ObjectId.isValid(cityId) || !mongoose.Types.ObjectId.isValid(venueTypeId)) {
      return res.status(400).json({ error: "Invalid cityId or venueTypeId" });
    }
    if (typeof lat !== 'number' || typeof long !== 'number') {
      return res.status(400).json({ error: "Latitude and Longitude must be numbers" });
    }

    if (!contactNo || typeof contactNo !== 'string') {
      return res.status(400).json({ error: "Contact number is required and must be a string" });
    }

    const newVenue = new Venue({
      name,
      userId,
      cityId,
      venueTypeId,
      venueCatId,
      location,
      lat,
      long,
      image,
      pricing,
      contactNo,
      kittiesHappened,
      kittiesBooked
    });

    await newVenue.save();

    res.status(201).json({ message: "Venue added successfully", venue: newVenue });
  } catch (err) {
    console.error("Error adding venue:", err);
    res.status(500).json({ error: "Failed to add venue", details: err.message });
  }
};

exports.updateVenue = async (req, res) => {
  try {
    const {
      name,
      venueCatId,
      userId,
      location,
      lat,
      long,
      image,
      pricing,
      contactNo,
      kittiesHappened,
      kittiesBooked
    } = req.body;

    // Validation checks
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: "Name is required and must be a string" });
    }

  
    if (!contactNo || typeof contactNo !== 'string') {
      return res.status(400).json({ error: "Contact number is required and must be a string" });
    }

    const updatedVenue = await Venue.findByIdAndUpdate(
      req.params.id,
      {
        name,
        userId,
        venueCatId,
        location,
        lat,
        long,
        image,
        pricing,
        contactNo,
        kittiesHappened,
        kittiesBooked
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
exports.filterVenues = async (req, res) => {
  try {
    const {
      cityName,
      venueTypeName,
      pricing,         // Pricing range filter (e.g., { min: 1000, max: 5000 })
      userLat,         // Latitude of user location
      userLong,        // Longitude of user location
      maxDistance,     // Max distance to venue from user location in km
      minKittiesHappened,
      maxKittiesBooked
    } = req.body;

    const filters = {};

    // Filter by city (use the field `cityId` in the schema)
    if (cityName) {
      const city = await mongoose.model('City').findOne({ name: cityName });  // Fetch city by name
      if (city) {
        filters['cityId'] = city._id;  // Use city ID to filter
      }
    }

    // Filter by venue type (use the field `venueTypeId` in the schema)
    if (venueTypeName) {
      const venueType = await mongoose.model('VenueType').findOne({ name: venueTypeName });  // Fetch venue type by name
      if (venueType) {
        filters['venueTypeId'] = venueType._id;  // Use venueType ID to filter
      }
    }

    // Filter by pricing (since pricing is a string, we assume it should be numerical, update schema if needed)
    if (pricing) {
      filters['pricing'] = {
        $gte: Number(pricing.min),   // Convert string to number
        $lte: Number(pricing.max)
      };
    }

    // Filter by kittiesHappened and kittiesBooked
    if (minKittiesHappened) {
      filters.kittiesHappened = { $gte: minKittiesHappened };
    }

    if (maxKittiesBooked) {
      filters.kittiesBooked = { $lte: maxKittiesBooked };
    }

    // Fetch venues with basic filters
    let venues = await Venue.find(filters);

    // Additional filtering by distance if userLat, userLong, and maxDistance are provided
    if (userLat && userLong && maxDistance) {
      venues = venues.filter(venue => {
        if (venue.lat && venue.long) {
          const venueDistance = calculateDistance(userLat, userLong, venue.lat, venue.long);
          return venueDistance <= maxDistance;
        }
        return false;
      });
    }

    // Return filtered venues
    res.status(200).json({ venues });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching venues', error });
  }
};

exports.getAllVenues = async (req, res) => {
  try {
    // Extract query parameters
    const { page = 1, limit = 5, name = '' } = req.query;

    // Convert page and limit to numbers
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    // Build the search query
    const searchQuery = name ? { name: new RegExp(name, 'i') } : {};

    // Perform aggregation to include average rating
    const venuesWithRatings = await Venue.aggregate([
      { $match: searchQuery }, // Match the search query
      {
        $lookup: {
          from: 'venuereviews', // Ensure this matches your review collection name
          localField: '_id',
          foreignField: 'venueId',
          as: 'reviews'
        }
      },
      {
        $addFields: {
          averageRating: {
            $cond: {
              if: { $gt: [{ $size: '$reviews' }, 0] },
              then: {
                $avg: '$reviews.rating'
              },
              else: 0
            }
          }
        }
      },
      { $sort: { createdAt: -1 } }, // Sort by createdAt in descending order

      
      {
        $skip: (pageNumber - 1) * pageSize
      },
      {
        $limit: pageSize
      }
    ]);

    // Count total number of documents matching the search query
    const totalCount = await Venue.countDocuments(searchQuery);

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / pageSize);

    // Send response with pagination info and average ratings
    res.status(200).json({
      data: venuesWithRatings,
      pagination: {
        page: pageNumber,
        limit: pageSize,
        totalPages,
        totalCount
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFilteredVenues = async (req, res) => {
  try {
    const { cityName, minPrice, maxPrice, userLat, userLong, maxDistance, name } = req.query;

    // Build the query object dynamically
    const query = {};

    // Filter by city name
    if (cityName) {
      query['location'] = cityName; // Adjust based on your schema
    }

    // Filter by pricing
    if (minPrice || maxPrice) {
      query['pricing'] = {};
      if (minPrice) {
        query['pricing']['$gte'] = Number(minPrice);
      }
      if (maxPrice) {
        query['pricing']['$lte'] = Number(maxPrice);
      }
    }

    // Filter by name if provided
    if (name) {
      query['name'] = { $regex: name, $options: 'i' }; // Case-insensitive search
    }

    // Fetch venues from the database
    let venues = await Venue.find(query);

    // Filter by distance if userLat and userLong are provided
    if (userLat && userLong && maxDistance) {
      venues = venues.filter(venue => {
        const venueDistance = haversineDistance(userLat, userLong, venue.lat, venue.long);
        return venueDistance <= Number(maxDistance);
      });
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

// exports.updateVenue = async (req, res) => {
//   try {
//     const {
//         name,
//         venueCatId,
//         userId,
//         location,
//         lat,
//         long,
//         image,
//         pricing,
//         contactNo,
//         kittiesHappened,  // Add these fields
//         kittiesBooked     // Add these fields
//     } = req.body;

//     const updatedVenue = await Venue.findByIdAndUpdate(
//       req.params.id,
//       {
//         name,
//         userId,
//         venueCatId,
//         location,
//         lat,
//         long,
//         image,
//         pricing,
//         contactNo,
//         kittiesHappened,   // Update field
//         kittiesBooked      // Update field
//       },
//       { new: true }
//     );

//     if (!updatedVenue) {
//       return res.status(404).json({ error: "Venue not found" });
//     }
//     res.status(200).json(updatedVenue);
//   } catch (err) {
//     console.error("Error updating Venue:", err);
//     res.status(500).json({ error: "Failed to update Venue" });
//   }
// };

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






//  Function to calculate distance using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Radius of the Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};





// {
//   "cityName": "New York",
//   "venueTypeName": "Banquet Hall",
//   "pricing": { "min": 1000, "max": 5000 },
//   "userLat": 40.7128,
//   "userLong": -74.0060,
//   "maxDistance": 20,
//   "minKittiesHappened": 10,
//   "maxKittiesBooked": 50
// }













