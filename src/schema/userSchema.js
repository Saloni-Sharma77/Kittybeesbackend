
const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({
  userId :{type:String},
  fullname:{type:String},
  dob:{type:Date},
  profession:{type:String},
//   location:{type:String},
email:{type:String},
password:{type:String},
phoneNumber:{type:String},
emergencyNumber:{type:String},
specificintrests:{type:String},
username:{type:String},
about:{type:String},
otp:{type:String},
otpExpiresAt:{type:String},
sociallinks: [
    {
      instaurl: { type: String },
      Linkedinurl: { type: String },
      Websiteurl: { type: String },
    }
  ],
  isnotvalid :{type:Boolean},
  phoneOtp:String,
  eventArr:{type:Array},
  partyArr:{type:Array},
  activityArr:{type:Array},


},{timestamps:true} );

module.exports = mongoose.model('Users', UsersSchema);
