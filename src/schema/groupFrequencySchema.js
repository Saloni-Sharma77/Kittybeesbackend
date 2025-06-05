const mongoose = require('mongoose');

const groupFrequencySchema = new mongoose.Schema({
    name :{type:String,
        unique: true, // Ensure the name is unique
        trim: true
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    isActive:{type:Boolean,default : true},
},{timestamps:true} );

module.exports = mongoose.model('groupfrequency', groupFrequencySchema);
