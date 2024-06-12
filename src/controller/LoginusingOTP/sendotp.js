// sendOtpSms.js

const axios = require('axios');

exports.sendOtpSms = async function(apiKey, senderName, recipientNumber, otp) {
    const url = "https://api.brevo.com/v3/transactionalSMS/sms";
    const payload = {
        sender: senderName,
        recipient: recipientNumber,
        content: `Your OTP code is: ${otp}`
    };
    const headers = {
        "accept": "application/json",
        "api-key": apiKey,
        "content-type": "application/json"
    };
    try {
        const response = await axios.post(url, payload, { headers });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};


const otpStorage = new Map(); // Example storage (in-memory, for demonstration purposes)

exports.storeOtp = function(userId, otp) {
    otpStorage.set(userId, {
        otp: otp,
        expiresAt: Date.now() + 5 * 60 * 1000 // OTP expires in 5 minutes
    });
};

exports.verifyOtp = function(userId, submittedOtp) {
    const storedOtpData = otpStorage.get(userId);
    if (!storedOtpData) {
        return { verified: false, message: "OTP not found" };
    }
    if (Date.now() > storedOtpData.expiresAt) {
        return { verified: false, message: "OTP expired" };
    }
    if (storedOtpData.otp === submittedOtp) {
        otpStorage.delete(userId); // Remove OTP after successful verification
        return { verified: true, message: "OTP verified" };
    }
    return { verified: false, message: "Invalid OTP" };
};
