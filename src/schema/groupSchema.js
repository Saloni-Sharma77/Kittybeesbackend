const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema(
  {
    name: { type: String },
    groupIcon: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    groupInterestId: [{ type: mongoose.Schema.Types.ObjectId, ref: "groupinterest" }],
    groupFrequencyId: { type: mongoose.Schema.Types.ObjectId, ref: "groupfrequency" },
    userIds: [{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
      status: { type: String, enum: ['pending', 'approved'], default: 'pending' }
  }],
    groupType: {
      type: String,
      enum: ["private", "public"],
      default: "private",
    },
    description: { type: String },
    rulesAndRegulation: { type: String },
    kittyFrequency: { type: String },
    groupCityArea: { type: String },
    image: { type: String },
    contributionAmount: { type: String },
    groupMembers: { type: String },
    isActive:{type:Boolean,default : true},
    interests: {type:String,},
    // GroupStatus: {type: String,enum: ['JoiniSatus', 'Requested'],required: true },
    winners: [{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
      winnerNumber: { type: Number }
    }],
    referralCode: { type: String, unique: false },

  },
  { timestamps: true }
);

module.exports = mongoose.model("groups", GroupSchema);
