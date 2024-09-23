const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
const User = require('../../schema/userSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
// Send OTP via SMS
exports.sendotptest = async (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    return res.status(400).send({ error: 'Phone number is required' });
  }
  try {
    const message = `Your OTP is  Please enter it within 10 minutes. Do not share it with anyone.`;

    await axios.post(`https://cpaas.messagecentral.com/verification/v3/send?countryCode=91&customerId=${process.env.MESSAGE_CENTRAL_USER_ID}&flowType=SMS&mobileNumber=${phoneNumber}`, 
      {
      message
    }, {
      headers: {
        'authToken': process.env.MESSAGE_CENTRAL_AUTH_TOKEN
      }
    });

    const filter = { phoneNumber };

    // Update the user document with the OTP and phone number (or insert if not found)
    const update = { 
      $set: { phoneNumber },  // Ensure the phone number is updated
    };

    const options = { upsert: true, new: true }; // Create the user if not found
    const updatedUser = await User.findOneAndUpdate(filter, update, options);

    res.status(200).send({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error.response ? error.response.data : error.message);
    res.status(500).send({ error: 'Failed to send OTP' });
  }
};

// Verify OTP



// Verify OTP via Message Central
exports.verifyotp = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).send({ error: 'Phone number and OTP are required' });
  }

  try {
    const otpRecord = await Otp.findOne({ phoneNumber });

    // Check if OTP record exists
    if (!otpRecord) {
      return res.status(400).send({ error: 'Phone number not found or no OTP request made' });
    }

    // Check if OTP has expired
    if (new Date() > otpRecord.otpExpiresAt) {
      return res.status(400).send({ error: 'OTP has expired' });
    }

    // Validate OTP using Message Central
    const response = await axios.get('https://cpaas.messagecentral.com/verification/v3/validateOtp', {
      params: {
        countryCode: '91',
        mobileNumber: phoneNumber,
        verificationId: otpRecord.otpTransactionId,
        customerId: process.env.MESSAGE_CENTRAL_USER_ID,
        code: otp
      },
      headers: {
        'authToken': process.env.MESSAGE_CENTRAL_AUTH_TOKEN
      }
    });

    if (response.data.status !== 'SUCCESS') {
      return res.status(400).send({ error: 'Invalid or expired OTP' });
    }

    // OTP is verified
    const token = jwt.sign({ phoneNumber }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Clear OTP details after successful verification
    otpRecord.otp = undefined;
    otpRecord.otpTransactionId = undefined;
    await otpRecord.save();

    res.status(200).send({
      success: true,
      message: 'OTP verified successfully',
      token: token
    });
  } catch (error) {
    console.error('Error verifying OTP:', error.response ? error.response.data : error.message);
    res.status(500).send({ error: 'Failed to verify OTP' });
  }
};

// Send OTP via WhatsApp
exports.sendotptestwhatsapp = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).send({ error: 'Phone number is required' });
  }

  try {
    const otp = generateSixDigitRandomNumber();  // Generate 6-digit OTP
    const otpExpiresAt = new Date(Date.now() + 10 * 60000); // OTP valid for 10 minutes

    const mediaUrl = 'https://dhorandjoy.s3-ap-southeast-1.amazonaws.com/your/subfolder/path/20246281352-239Prescription.pdf';

    // Send OTP via Message Central
    await axios.post(`https://cpaas.messagecentral.com/verification/v3/send?countryCode=91&customerId=${process.env.MESSAGE_CENTRAL_USER_ID}&flowType=WHATSAPP&mobileNumber=${phoneNumber}`, {
      message: `Your OTP is ${otp}`,  // Include the generated OTP in the message
      media_url: mediaUrl,
    }, {
      headers: {
        'authToken': process.env.MESSAGE_CENTRAL_AUTH_TOKEN,
      }
    });

    // Update or insert user OTP data
    const filter = { phoneNumber };
    const update = { otp, otpExpiresAt };
    const options = { upsert: true, new: true };
    const updatedUser = await User.findOneAndUpdate(filter, update, options);

    res.status(200).send({ success: true, message: 'OTP sent successfully via WhatsApp', otp: otp });
  } catch (error) {
    console.error('Error sending OTP via WhatsApp:', error.response ? error.response.data : error.message);
    res.status(500).send({ error: 'Failed to send OTP' });
  }
};
