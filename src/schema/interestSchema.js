const mongoose = require('mongoose');

const interestSchema = new mongoose.Schema({
    name :{type:String,
        unique: true, // Ensure the name is unique
        trim: true
    },
    isActive:{type:Boolean,default : true},
},{timestamps:true} );

module.exports = mongoose.model('interests', interestSchema);
