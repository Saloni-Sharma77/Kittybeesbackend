
const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    name :{type:String},
    description: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    // createdBy: { type: String, enum: ['admin', 'user'], default: 'admin' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    isActive:{type:Boolean,default : true},
    icon: {
        type: String,
      },

},{timestamps:true} );

module.exports = mongoose.model('activity', activitySchema);
