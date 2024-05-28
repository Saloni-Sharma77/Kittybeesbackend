const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const saltRounds = 10;
const UsersModel = require("../schema/userSchema");
const fast2sms = require("fast-two-sms");
const { generateOTP } = require("../controller/otpcontroller");

exports.loginWithPhoneOtp = async (req, res) => {
    const { phoneNumber } = req.body;  

    if (!phoneNumber) {
        return res.status(400).json({ message: 'Phone number is required' });
    }

    try {
        console.log('Received phone number:', phoneNumber);

        const payload = {
            variables_values: '123456',
            route: 'otp',
            numbers: phoneNumber,  
        };

        const config = {
            headers: {
                'Authorization': 'a9L5qXxwXSnXPtUuTJYPn0VxEyAOHvPYanj6lqzysTzjmFGOSRqNun1t0qob',
                'Content-Type': 'application/json'
            }
        };

        console.log('Sending OTP to:', phoneNumber);
        console.log('Payload:', payload);

        const response = await axios.post('https://www.fast2sms.com/dev/bulkV2', payload, config);

        if (response.data.return) {
            console.log('OTP sent successfully:', response.data);
            return res.status(200).json({ message: 'OTP sent successfully' });
        } else {
            console.error('Failed to send OTP:', response.data);
            return res.status(500).json({ message: 'Failed to send OTP', data: response.data });
        }
    } catch (error) {
        if (error.response) {
            console.error('Error in sending OTP:', error.response.data);
            return res.status(500).json({ message: 'Error in sending OTP', error: error.response.data });
        } else {
            console.error('Error in sending OTP:', error.message);
            return res.status(500).json({ message: 'Error in sending OTP', error: error.message });
        }
    }
}; 
  exports.adduserInfo = async (req, res) => {
    const { fullname, dob, phoneNumber, profession ,email,emergencyNumber,specificintrests, username, about,sociallinks} = req.body;

    console.log(req.body,'response')
  
    try {
      const newUser = new UsersModel({
        fullname, dob, phoneNumber, profession ,email,emergencyNumber,specificintrests, username, about,sociallinks
      });
      await newUser.save();
      res.status(201).json({ message: "user Information  added successfully", data: newUser });
    } catch (error) {
      console.error("Error adding basic information:", error);
      res
        .status(500)
        .json({ error: "Failed to add basic information", details: error.message });
    }
  };
  