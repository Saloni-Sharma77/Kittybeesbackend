const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const saltRounds = 10;
const UsersModel = require("../schema/userSchema");
const fast2sms = require("fast-two-sms");
const { generateOtp } = require("./LoginusingOTP/otpcontroller");
const { sendOtpSms } = require('../controller/LoginusingOTP/sendotp');
const { storeOtp, verifyOtp } = require('../controller/LoginusingOTP/sendotp');

const apiKey = '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';
const senderName = 'saloni';

exports.loginWithPhoneOtp = async (req, res) => {
    const { userId, phoneNumber } = req.body;
    const otp = generateOtp();
    storeOtp(userId, otp);
    const response = await sendOtpSms(apiKey, senderName, phoneNumber, otp);
    res.json(response);
};

exports.verifyPhoneOtp = (req, res) => {
    const { userId, otp } = req.body;
    const result = verifyOtp(userId, otp);
    if (result.verified) {
        res.status(200).json({ message: result.message });
    } else {
        res.status(400).json({ message: result.message });
    }
};




exports.adduserInfo = async (req, res) => {
    const { fullname, dob, phoneNumber, profession, email, emergencyNumber, specificintrests, username, about, sociallinks } = req.body;

    console.log(req.body, 'response')

    try {
        const newUser = new UsersModel({
            fullname, dob, phoneNumber, profession, email, emergencyNumber, specificintrests, username, about, sociallinks
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

