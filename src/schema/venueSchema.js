
const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  name :{type:String},
  userId:{type:String,ref:'Users'},
  location:{type:String},
  isActive:{type:Boolean, default: true}

},{timestamps:true} );

module.exports = mongoose.model('venues', GroupSchema);
