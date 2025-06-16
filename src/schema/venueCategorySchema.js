
const mongoose = require('mongoose');

const venueCategorySchema = new mongoose.Schema({
    name :{type:String},
    isActive:{type:Boolean,default : true},
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
},{timestamps:true} );

module.exports = mongoose.model('venueCategory', venueCategorySchema);
