const mongoose = require('mongoose'); // Ensure mongoose is imported
const City = require('../../schema/citySchema');
const VenueType = require('../../schema/typeofvanueSchema');
const Venue = require("../../schema/venueSchema");
const VenueReview = require('../../schema/venueReviewSchema'); // Ensure this import matches your path

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
    } = req.body;

    // Validation check for cityId and venueTypeId
    if (!mongoose.Types.ObjectId.isValid(cityId) || !mongoose.Types.ObjectId.isValid(venueTypeId)) {
        return res.status(400).json({ error: "Invalid cityId or venueTypeId" });
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
        contactNo
    });

    await newVenue.save();

    res.status(201).json({ message: "Venue added successfully", venue: newVenue });
  } catch (err) {
    console.error("Error adding venue:", err);
    res.status(500).json({ error: "Failed to add venue", details: err.message });
  }
};











// Get all venues
// exports.getAllVenues = async (req, res) => {
//   try {
//     // Extract query parameters
//     const { page = 1, limit = 5, name = '' } = req.query;

//     // Convert page and limit to numbers
//     const pageNumber = parseInt(page, 10);
//     const pageSize = parseInt(limit, 10);

//     // Build the search query
//     const searchQuery = name ? { name: new RegExp(name, 'i') } : {};

//     // Fetch venues with pagination and search
//     const venues = await Venue.find(searchQuery)
//       .skip((pageNumber - 1) * pageSize)
//       .limit(pageSize);

//     // Count total number of documents matching the search query
//     const totalCount = await Venue.countDocuments(searchQuery);

//     // Calculate total pages
//     const totalPages = Math.ceil(totalCount / pageSize);

//     // Send response with pagination info
//     res.status(200).json({
//       data: venues,
//       pagination: {
//         page: pageNumber,
//         limit: pageSize,
//         totalPages,
//         totalCount
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

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

exports.filterVenues = async (req, res) => {
  try {
      const { cityName, venueTypeName, pricing, userLat, userLong, maxDistance } = req.body;

      const filters = {};

      // Step 1: Apply city filter if cityName is provided
      if (cityName) {
          const city = await City.findOne({ name: cityName });
          if (!city) {
              return res.status(404).json({ message: 'City not found' });
          }
          filters.cityId = city._id;
      }

      // Step 2: Apply venue type filter if venueTypeName is provided
      if (venueTypeName) {
          const venueType = await VenueType.findOne({ type: venueTypeName });
          if (!venueType) {
              return res.status(404).json({ message: 'Venue type not found' });
          }
          filters.venueTypeId = venueType._id;
      }

      // Step 3: Apply price range filter if pricing object is provided
      if (pricing && (pricing.minPrice !== undefined || pricing.maxPrice !== undefined)) {
          filters.pricing = {
              $gte: pricing.minPrice || 0,
              $lte: pricing.maxPrice || Infinity
          };
      }

      // Step 4: Find venues based on the applied filters
      let venues = await Venue.find(filters);

      // Step 5: Apply distance filter if userLat, userLong, and maxDistance are provided
      if (userLat && userLong && maxDistance) {
          venues = venues.filter((venue) => {
              const distance = calculateDistance(userLat, userLong, venue.lat, venue.long);
              return distance <= maxDistance;
          });
      }

      res.status(200).json(venues);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};
// {
//   "cityName": "Udaipur",
//   "venueTypeName": "Conference",
//   "pricing": "5000"
// }













