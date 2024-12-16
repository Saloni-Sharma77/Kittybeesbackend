const mongoose = require('mongoose');

const walletcategeoryschema = new mongoose.Schema({
    name :{type:String,
        trim: true
    },
    isActive:{type:Boolean,default : true},
},{timestamps:true} );

module.exports = mongoose.model('walletcategory', walletcategeoryschema);
