const Venue = require('../../schema/groupSchema'); // Adjust path as necessary
const Filter = require('../../schema/filterSchema'); // Adjust path as necessary


// Filter venues based on filter criteria provided in the request body
exports.filterVenues = async (req, res) => {
    try {
        const { city, type, minPrice, maxPrice, maxDistance } = req.body;

        // Construct the filter query
        const filterCriteria = {};

        if (city) filterCriteria.cityId = city; // Assuming cityId is used in venues schema
        if (type) filterCriteria.venueCatId = type; // Assuming venueCatId represents type
        if (minPrice || maxPrice) {
            filterCriteria.pricing = {
                $gte: minPrice || 0,
                $lte: maxPrice || Infinity
            };
        }
        if (maxDistance) {
            // Assuming you have a way to calculate distance based on lat and long
            // For simplicity, assuming maxDistance is in km and you have distance calculation logic elsewhere
            filterCriteria.distance = { $lte: maxDistance };
        }

        // Find matching venues
        const venues = await Venue.find(filterCriteria).populate('venueCatId').populate('cityId');

        res.status(200).json({
            message: "Filtered venues fetched successfully",
            venues
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};