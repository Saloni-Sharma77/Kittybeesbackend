const mongoose = require('mongoose');

const bookingRequestSchema = new mongoose.Schema({
    contactPersonName: { type: String, required: true },
    emailAddress: { type: String, required: true },
    contactNumber: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    minimumGuests: { type: Number, required: true },
    vegNonVegDrinks: {
        type: [String],
        enum: ['Veg', 'NonVeg', 'Drinks'],
        required: true
    },
    preference: {
        type: String,
        enum: ['Buffet', 'AlaCarte', 'MainCourse'],
        required: true
    },
    starters: { type: [String], default: [] },
    mainCourse: { type: [String], default: [] },
    sweets: { type: [String], default: [] },
    drinks: { type: [String], default: [] },
    message: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('BookingRequest', bookingRequestSchema);
