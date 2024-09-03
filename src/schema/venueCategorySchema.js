
const mongoose = require('mongoose');

const venueCategorySchema = new mongoose.Schema({
    name :{type:String},
    isActive:{type:Boolean,default : true},

},{timestamps:true} );

module.exports = mongoose.model('venueCategory', venueCategorySchema);
