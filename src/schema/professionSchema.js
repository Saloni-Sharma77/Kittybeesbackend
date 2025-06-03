const mongoose = require('mongoose')

const professionSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
})

const profession = mongoose.model('profession',professionSchema)

module.exports = profession