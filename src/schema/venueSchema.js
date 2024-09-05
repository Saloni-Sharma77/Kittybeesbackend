
const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  name :{type:String},
  userId:{type:String,ref:'Users'},
  venueCatId:{type:String,ref:'venueCategory'},
  location:{type:String},
  lat:{type:String},
  long:{type:String},
  image:{type:String},
  pricing:{type:String},
  contactNo:{type:String},
  isActive:{type:Boolean, default: true}

},{timestamps:true} );

module.exports = mongoose.model('venues', GroupSchema);
