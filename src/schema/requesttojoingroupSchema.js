// models/requesttojoingroupschema.js
const mongoose = require('mongoose');

const requestToJoinGroupSchema = new mongoose.Schema({
    groupId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'groups', // This refers to the Group model
        required: true 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users', // This refers to the User model
        required: true 
    },
    requestDate: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('RequestToJoinGroup', requestToJoinGroupSchema);
