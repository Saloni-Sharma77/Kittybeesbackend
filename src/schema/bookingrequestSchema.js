const mongoose = require('mongoose');

const bookingRequestSchema = new mongoose.Schema({
    contactPersonName: { type: String,  },
    emailAddress: { type: String,  },
    contactNumber: { type: String,  },
    date: { type: Date, },
    time: { type: String,  },
    minimumGuests: { type: Number, },
    vegNonVegDrinks: {
        type: [String],
        enum: ['Veg', 'NonVeg', 'Drinks'],
        
    },
    preference: {
        type: String,
        enum: ['Buffet', 'AlaCarte', 'MainCourse'],
        
    },
    starters: { type: [String], default: [] },
    mainCourse: { type: [String], default: [] },
    sweets: { type: [String], default: [] },
    drinks: { type: [String], default: [] },
    message: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('BookingRequest', bookingRequestSchema);
