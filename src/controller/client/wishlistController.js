// Import WishListModel
const WishListModel = require('../../schema/wishlistSchema');
const mongoose = require('mongoose'); // Ensure mongoose is imported at the top

// Add a new wishlist
exports.addWishlist = async (req, res) => {
  try {
    const { userId, venueId } = req.body;

    // Check if the wishlist item already exists
    const existingWishlist = await WishListModel.findOne({ userId, venueId });
    if (existingWishlist) {
      return res.status(400).json({ message: 'Item already in wishlist' });
    }

    // Create new wishlist entry
    const newWishlist = new WishListModel({
      userId,
      venueId,
    });
    
    // Save the wishlist to the database
    await newWishlist.save();

    res.status(201).json({ message: 'Wishlist created successfully', data: newWishlist });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Get all wishlists
exports.getAllWishlist = async (req, res) => {
  try {
    // Fetch all wishlists, populate userId and venueId with user and venue information
    const wishlists = await WishListModel.find()
      .populate('userId', 'fullname') // Populate only necessary fields
      .populate('venueId');

    res.status(200).json({ message: 'All wishlists fetched successfully', data: wishlists });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all wishlists by user ID
// exports.getAllWishlistByme = async (req, res) => {
//   try {
//       const userId = req.params.id;
//       console.log('Fetching wishlists for user ID:', userId); // Debug log

//       // Validate userId
//       if (!userId) {
//           return res.status(400).json({ message: 'User ID is required' });
//       }

//       const wishlists = await WishListModel.find({ userId })
//           .populate('venueId');

//       res.status(200).json({ message: 'Wishlists by user fetched successfully', data: wishlists });
//   } catch (err) {
//       console.error('Error details:', err); // Log the full error object
//       res.status(500).json({ message: 'Internal server error', error: err.message });
//   }
// };
exports.getAllWishlistByme = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name } = req.query; // Optional query parameter for venue name

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Build the aggregation pipeline
    const wishlists = await WishListModel.aggregate([
      // Step 1: Match the userId
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId) // Match the userId in the wishlist
        }
      },
      // Step 2: Lookup venue details from the Venue collection
      {
        $lookup: {
          from: 'venues', // Collection name of Venue
          localField: 'venueId', // Field in Wishlist schema
          foreignField: '_id', // Field in Venue schema
          as: 'venue' // The resulting array field
        }
      },
      // Step 3: Unwind the venue array to make it a single object
      {
        $unwind: {
          path: '$venue',
          preserveNullAndEmptyArrays: true // Keep wishlist even if venue details are missing
        }
      },
      // Step 4: Optional filter by venue name
      ...(name
        ? [
            {
              $match: {
                'venue.name': { $regex: name, $options: 'i' } // Case-insensitive search
              }
            }
          ]
        : []),
      // Step 5: Lookup reviews from the Review collection
      {
        $lookup: {
          from: 'venuereviews', // Collection name of VenueReviews
          localField: 'venue._id', // Venue ID in the wishlist
          foreignField: 'venueId', // Venue ID in the reviews
          as: 'reviews' // The resulting array field
        }
      },
      // Step 6: Calculate average rating
      {
        $addFields: {
          averageRating: {
            $cond: {
              if: { $gt: [{ $size: '$reviews' }, 0] }, // If reviews exist
              then: { $avg: '$reviews.rating' }, // Calculate average
              else: 0 // Default to 0 if no reviews
            }
          }
        }
      },
      // Step 7: Project the required fields
      {
        $project: {
          _id: 1,
          userId: 1,
          venue: 1, // Include venue details
          isActive: 1,
          createdAt: 1,
          updatedAt: 1,
          reviews: 1,
          averageRating: 1 // Include average rating
        }
      }
    ]);

    // Return the response
    res.status(200).json({
      message: 'Wishlists by user fetched successfully',
      data: wishlists
    });
  } catch (err) {
    console.error('Error details:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};







// Get a single wishlist by wishlist ID
exports.getWishlistById = async (req, res) => {
  try {
    const wishlistId = req.params.id;

    // Find wishlist by ID
    const wishlist = await WishListModel.findById(wishlistId)
      .populate('userId', 'fullname')
      .populate('venueId', 'name');

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    res.status(200).json({ message: 'Wishlist fetched successfully', data: wishlist });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a wishlist by wishlist ID
exports.updateWishlistById = async (req, res) => {
  try {
    const wishlistId = req.params.id;
    const updateData = req.body;

    // Find wishlist by ID and update it
    const updatedWishlist = await WishListModel.findByIdAndUpdate(wishlistId, updateData, {
      new: true, // return the updated document
      runValidators: true, // run schema validation
    });

    if (!updatedWishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    res.status(200).json({ message: 'Wishlist updated successfully', data: updatedWishlist });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a wishlist by wishlist ID
exports.deleteWishlistById = async (req, res) => {
  try {
    const { venueId, userId } = req.params;

    // Find wishlist by venueId and userId and delete it
    const deletedWishlist = await WishListModel.findOneAndDelete({ venueId: venueId, userId: userId });



    if (!deletedWishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    res.status(200).json({ message: 'Wishlist deleted successfully', data: deletedWishlist });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
