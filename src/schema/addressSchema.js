
const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    address :{type:String},
    description: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    isActive:{type:Boolean,default : true},
},{timestamps:true} );

module.exports = mongoose.model('address', addressSchema);
