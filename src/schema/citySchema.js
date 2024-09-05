
const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
    name :{type:String},
    isActive:{type:Boolean,default : true},
},{timestamps:true} );

module.exports = mongoose.model('city', citySchema);
