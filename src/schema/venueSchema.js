
const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  name :{type:String},
  userId:{type:String,ref:'Users'},
  location:{type:String},

},{timestamps:true} );

module.exports = mongoose.model('venues', GroupSchema);
