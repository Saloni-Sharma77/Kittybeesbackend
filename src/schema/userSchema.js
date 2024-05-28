
const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({
  
  fullname:{type:String},
  dob:{type:Date},
  profession:{type:String},
//   location:{type:String},
email:{type:String},
phoneNumber:{type:String},
emergencyNumber:{type:String},
specificintrests:{type:String},
username:{type:String},
about:{type:String},
sociallinks: [
    {
      instaurl: { type: String },
      Linkedinurl: { type: String },
      Websiteurl: { type: String },
    }
  ],
  isnotvalid :{type:Boolean},
  phoneOtp:String,


},{timestamps:true} );

module.exports = mongoose.model('Users', UsersSchema);
