

const mongoose = require('mongoose');

const interestSchema = new mongoose.Schema({
    name :{type:String},
    isActive:{type:Boolean,default : true},
},{timestamps:true} );

module.exports = mongoose.model('interests', interestSchema);
