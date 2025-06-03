
const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema({
    name :{type:String},
    image: { type: String },
    backgroundimage: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    isActive:{type:Boolean,default : true},

},{timestamps:true} );

module.exports = mongoose.model('theme', themeSchema);
