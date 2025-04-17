const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema(
  {
    name: { type: String },
    groupInterestId: [{ type: mongoose.Schema.Types.ObjectId, ref: "groupinterest" }],
    groupFrequencyId: { type: mongoose.Schema.Types.ObjectId, ref: "groupfrequency" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    userIds: [{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
      status: { type: String, enum: ['pending', 'approved','rejected,isrequesteduser'], default: 'approved' }
  }],
    groupType: {
      type: String,
      enum: ["private", "public"],
      default: "private",
    },
    description: { type: String },
    rulesAndRegulation: { type: String },
    groupCityArea: { type: String },
    image: { type: String },
    contributionAmount: { type: String },
    isActive:{type:Boolean,default : true},
    interests: {type:String,},
    // GroupStatus: {type: String,enum: ['JoiniSatus', 'Requested'],required: true },
    winners: [{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
      winnerNumber: { type: Number }
    }],
    groupMemories:[{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
      memoryimage: { type: String }, 
      }],
      referralCode:{type:String},
      userNumbers:[
        { type: String }
      ],

    // newUser:{
    //  type:String
    // }
  },
  { timestamps: true }
);

module.exports = mongoose.model("groups", GroupSchema);
