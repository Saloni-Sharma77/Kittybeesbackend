const VenueReview = require('../../schema/venueReviewSchema');

exports.createReview = async (req, res) => {
    try {
        const review = new VenueReview(req.body);
        await review.save();
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getReviews = async (req, res) => {
    try {
        // Log the venueId for debugging
        console.log('Fetching reviews for venueId:', req.params.venueId);

        // Find reviews for the venue and populate the user details
        const reviews = await VenueReview.find({ venueId: req.params.venueId }).populate('userId');

        // Check if any reviews are found
        if (!reviews.length) {
            return res.status(404).json({ message: 'No reviews found for this venue.' });
        }

        // Return the reviews
        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.updateReview = async (req, res) => {
    try {
        const review = await VenueReview.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const review = await VenueReview.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }
        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
