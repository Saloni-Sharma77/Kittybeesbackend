
const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
    name: { type: String ,unique:true},
    isActive:{type:Boolean,default : true},

},{timestamps:true} );

module.exports = mongoose.model('color', colorSchema);
