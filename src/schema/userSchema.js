
const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({
  userId :{type:String},
  fullname:{type:String},
  dob:{type:Date},
  image:{type:String},
  profession:{type:String},
  location:{type:String},
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
  phoneOtp:{type:String},
  isActive:{type:Boolean,default : true},
  eventArr:{type:Array},
  role:{ type: String,enum:['user','admin'],default:'user'},
  verifiedBy:{ type: String,enum:['aadhar','video','notyet'],default:'notyet'},
  partyArr:{type:Array},
  activityArr:{type:Array},
  profileImage:{type:String,default : 'https://kittybee.s3.ap-south-1.amazonaws.com/profile_images/defaultProfile.png'},




},{timestamps:true} );

module.exports = mongoose.model('Users', UsersSchema);
