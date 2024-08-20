
const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  name :{type:String},
  userId:{type:String,ref:'Users'},
  location:{type:String},
  lat:{type:String},
  long:{type:String},
  startTime:{type:String},
  endTime:{type:String},
  isActive:{type:Boolean, default: true}

},{timestamps:true} );

module.exports = mongoose.model('venues', GroupSchema);
