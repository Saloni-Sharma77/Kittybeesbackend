const BookingRequest = require('../../schema/bookingrequestSchema'); // Adjust path as necessary

// Create a new booking request
exports.createBookingRequest = async (req, res) => {
    try {
        const bookingRequest = new BookingRequest(req.body);
        await bookingRequest.save();
        res.status(201).json({ message: "Booking request created successfully", bookingRequest });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: "Error creating booking request", error: err.message });
    }
};

// Get all booking requests
exports.getAllBookingRequests = async (req, res) => {
    try {
        const bookingRequests = await BookingRequest.find();
        res.status(200).json({ message: "Booking requests fetched successfully", bookingRequests });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get a booking request by ID
exports.getBookingRequestById = async (req, res) => {
    try {
        const { id } = req.params;
        const bookingRequest = await BookingRequest.findById(id);
        if (!bookingRequest) {
            return res.status(404).json({ message: "Booking request not found" });
        }
        res.status(200).json({ message: "Booking request fetched successfully", bookingRequest });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update a booking request by ID
exports.updateBookingRequestById = async (req, res) => {
    try {
        const { id } = req.params;
        const bookingRequest = await BookingRequest.findByIdAndUpdate(id, req.body, { new: true });
        if (!bookingRequest) {
            return res.status(404).json({ message: "Booking request not found" });
        }
        res.status(200).json({ message: "Booking request updated successfully", bookingRequest });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: "Error updating booking request", error: err.message });
    }
};

// Delete a booking request by ID
exports.deleteBookingRequestById = async (req, res) => {
    try {
        const { id } = req.params;
        const bookingRequest = await BookingRequest.findByIdAndDelete(id);
        if (!bookingRequest) {
            return res.status(404).json({ message: "Booking request not found" });
        }
        res.status(200).json({ message: "Booking request deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};
