
const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema({
    name :{type:String},
    image: { type: String },
    backgroundimage: { type: String },
    isActive:{type:Boolean,default : true},

},{timestamps:true} );

module.exports = mongoose.model('theme', themeSchema);
