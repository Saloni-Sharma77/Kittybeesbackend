
const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    name :{type:String},
    description: { type: String },
    isActive:{type:Boolean,default : true},

},{timestamps:true} );

module.exports = mongoose.model('activity', activitySchema);
