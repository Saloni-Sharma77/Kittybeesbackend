
const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  name :{type:String},
  groupIcon :{type:String},
  userId:{type:String,ref:'Users'},
  groupType: { type: String, enum: ['private', 'public'], default: 'private' },
  description:{type:String},
rulesAndRegulation:{type:String},
kittyFrequency:{type:String},
groupCityArea:{type:String},
contributionAmount:{type:String},
groupMembers:{type:String},

},{timestamps:true} );

module.exports = mongoose.model('venues', GroupSchema);
