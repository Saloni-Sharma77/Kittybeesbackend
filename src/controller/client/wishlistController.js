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

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const wishlists = await WishListModel.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: 'venues', // Assuming 'venues' is the collection name for venues
          localField: 'venueId',
          foreignField: '_id',
          as: 'venueId' // Populate venueId directly
        }
      },
      {
        $unwind: {
          path: '$venueId',
          preserveNullAndEmptyArrays: true // Optional, if no venue is found
        }
      },
      {
        $lookup: {
          from: 'venuereviews', // Lookup for reviews
          localField: 'venueId._id', // Reference the populated venueId
          foreignField: 'venueId',
          as: 'reviews'
        }
      },
      {
        $addFields: {
          averageRating: {
            $cond: {
              if: { $gt: [{ $size: '$reviews' }, 0] },
              then: { $avg: '$reviews.rating' },
              else: 0
            }
          }
        }
      }
    ]);

    res.status(200).json({ message: 'Wishlists by user fetched successfully', data: wishlists });
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
