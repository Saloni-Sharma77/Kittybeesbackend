// const Venue = require('../../schema/venueSchema'); // Path to your venues model
// const Filter = require('../../schema/filterSchema'); // Path to your filter model

// // Filter venues based on the city, type, and price range
// exports.filterVenues = async (req, res) => {
//     try {
//         // Get filter criteria from the request body
//         const { city, type, price, distance } = req.body;

//         // Find venues that match the filter criteria
//         const filteredVenues = await Venue.find({
//             cityId: city, // Assuming cityId matches the city name or ID
//             venueTypeId: type, // Assuming venueTypeId stores the type ('Restaurant', 'BanquetHall', 'Lawn')
//             pricing: { 
//                 $gte: price.min, // Greater than or equal to min price
//                 $lte: price.max  // Less than or equal to max price
//             },
//             isActive: true // Only fetch active venues
//         });

//         if (filteredVenues.length === 0) {
//             return res.status(404).json({ message: "No venues found for the given filter criteria" });
//         }

//         res.status(200).json({ message: "Filtered venues retrieved successfully", venues: filteredVenues });
//     } catch (err) {
//         res.status(500).json({ message: "Error filtering venues", error: err.message });
//     }
// };
