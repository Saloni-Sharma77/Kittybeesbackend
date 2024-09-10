const mongoose = require('mongoose');

const typeSchema = new mongoose.Schema({
    type: { 
        type: String,  // No enum restriction
        required: true 
    },
    isActive: { 
        type: Boolean, 
        default: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('Type', typeSchema);
