// Import WishListModel
const WishListModel = require('../../schema/wishlistSchema');

// Add a new wishlist
exports.addWishlist = async (req, res) => {
  try {
    const { name, userId, venueId, description, image, isActive } = req.body;


    const newWishlist = new WishListModel({
      name,
      userId,
      venueId,
      description,
      image,
      isActive,
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
      .populate('venueId', 'name');

    res.status(200).json({ message: 'All wishlists fetched successfully', data: wishlists });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all wishlists by user ID
exports.getAllWishlistByme = async (req, res) => {
  try {
      const userId = req.params.id;
      console.log('Fetching wishlists for user ID:', userId); // Debug log

      // Validate userId
      if (!userId) {
          return res.status(400).json({ message: 'User ID is required' });
      }

      const wishlists = await WishListModel.find({ userId })
          .populate('userId', 'fullname')
          .populate('venueId', 'name');

      res.status(200).json({ message: 'Wishlists by user fetched successfully', data: wishlists });
  } catch (err) {
      console.error('Error details:', err); // Log the full error object
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
    const wishlistId = req.params.id;

    // Find wishlist by ID and delete it
    const deletedWishlist = await WishListModel.findByIdAndDelete(wishlistId);

    if (!deletedWishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    res.status(200).json({ message: 'Wishlist deleted successfully', data: deletedWishlist });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
