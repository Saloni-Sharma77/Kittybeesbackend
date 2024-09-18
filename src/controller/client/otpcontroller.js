const dotenv = require("dotenv");
dotenv.config();
const User = require("../../schema/userSchema");
const twilio = require("twilio");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  
  
  function generateSixDigitRandomNumber() {
    let randomNumber = "";
    for (let i = 0; i < 6; i++) {
      randomNumber += Math.floor(Math.random() * 10);
    }
    return randomNumber;
  }
  
  
  // Send TEXT OTP
  exports.sendotp = async (req, res) => {
    const { phoneNumber } = req.body;
    console.log(phoneNumber);
    if (!phoneNumber) {
      return res.status(400).send({ error: "Phone number is required" });
    }
    
    try {
      const otp = generateSixDigitRandomNumber();
      const otpExpiresAt = new Date(Date.now() + 50 * 6000000);
      
      // Send OTP via Twilio
      // await client.messages.create({
      //   body: `Your OTP is ${otp}`,
      //   from: "+12055129013",
      //   to: phoneNumber,
      // });
      
      // Update or insert user OTP data

      const filter = { phoneNumber };
      const update = { otp, otpExpiresAt };
      const options = { upsert: true, new: true };
      const updatedUser = await User.findOneAndUpdate(filter, update, options);
     
      res.status(200).send({ success: true, message: "OTP sent successfully" ,otp:otp});
    } catch (error) {
      console.error("Error sending OTP:", error);
      res.status(500).send({ error: "Failed to send OTP" });
    }
  };


  //verify
  // exports.verifyotp = async (req, res) => {
  //   const { phoneNumber, otp } = req.body;
  //   if (!phoneNumber || !otp) {
  //     return res.status(400).send({ error: "Phone number and OTP are required" });
  //   }
  //   try {
  //     const user = await User.findOne({ phoneNumber });
  //     if (!user) {
  //       return res.status(400).send({ error: "Phone number not found" });
  //     }
  //     if (user.otp !== otp || new Date() > user.otpExpiresAt) {
  //       return res.status(400).send({ error: "Invalid or expired OTP" });
  //     }
  //     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
  //       expiresIn: "1h",
  //     });
  //     user.otp = undefined;
  //     user.otpExpiresAt = undefined;
  //     await user.save();
  //     res
  //       .status(200)
  //       .send({ success: true, message: "OTP verified successfully" ,token:token});
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).send({ error: "Failed to verify OTP" });
  //   }
  // };
  exports.verifyotp = async (req, res) => {
    const { phoneNumber, otp } = req.body;
    if ( !otp) {
      return res.status(400).send({ error: "Phone number and OTP are required" });
    }
    try {
        const user = await User.findOne({ phoneNumber });
        if (!user) {
            return res.status(400).send({ error: "Phone number not found" });
        }
        if (user.otp !== otp || new Date() > user.otpExpiresAt) {          
            return res.status(400).send({ error: "Invalid or expired OTP" });
        }
       let fullnameExists = false;
        if(user.fullname){
          fullnameExists = true

        }

        // OTP is verified, now check if the user exists
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        user.otp = undefined;
        user.otpExpiresAt = undefined;
        await user.save();

        res.status(200).send({ 
            success: true, 
            message: "OTP verified successfully", 
            user:user,
            fullname:user?.fullname,
            username:user?.username,
            token: token,
            fullnameExists: fullnameExists  // true if user exists, false otherwise
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Failed to verify OTP" });
    }
};

  exports.isUserLoggedIn = async (req,res)=>{
    const { phoneNumber } = req.body;

    try {
      let isLoggedIn = false;
      const user = await User.findOne({ phoneNumber });
      if(user){
        isLoggedIn = true
      }
      res
      .status(200)
      .send({isLoggedIn:isLoggedIn});

      
    } catch (error) {
      res.status(500).send({ error: error });
      
    }

  }

    // Send TEXT OTP
    exports.sendotpwhatsapp = async (req, res) => {
        const { phoneNumber } = req.body;
        
        if (!phoneNumber) {
          return res.status(400).send({ error: "Phone number is required" });
        }
        
        try {
          const otp = generateSixDigitRandomNumber();
          const otpExpiresAt = new Date(Date.now() + 10 * 60000);
          
        const mediaUrl =  'https://dhorandjoy.s3-ap-southeast-1.amazonaws.com/your/subfolder/path/20246281352-239Prescription.pdf'
          // Send OTP via Twilio
          await client.messages.create({
            body: `Your OTP is ${otp}`,
            from: 'whatsapp:+14155238886', 
            to: `whatsapp:${phoneNumber}`,
            mediaUrl: [mediaUrl],
          });
          
          // Update or insert user OTP data
          const filter = { phoneNumber };
          const update = { otp, otpExpiresAt };
          const options = { upsert: true, new: true };
          const updatedUser = await User.findOneAndUpdate(filter, update, options);
          
          res.status(200).send({ success: true, message: "OTP sent successfully",updatedUser:updatedUser ,otp:otp});
        } catch (error) {
          console.error("Error sending OTP:", error);
          res.status(500).send({ error: "Failed to send OTP" });
        }
      };