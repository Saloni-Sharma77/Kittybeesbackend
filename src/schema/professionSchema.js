const mongoose = require('mongoose')

const professionSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    }
})

const profession = mongoose.model('profession',professionSchema)

module.exports = profession