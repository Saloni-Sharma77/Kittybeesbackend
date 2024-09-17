const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
const User = require('../../schema/userSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Generate six-digit random number
function generateSixDigitRandomNumber() {
  let randomNumber = '';
  for (let i = 0; i < 6; i++) {
    randomNumber += Math.floor(Math.random() * 10);
  }
  return randomNumber;
}

// Send OTP via SMS
exports.sendotp = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).send({ error: 'Phone number is required' });
  }

  try {
    const otp = generateSixDigitRandomNumber();  // Generate 6-digit OTP
    const otpExpiresAt = new Date(Date.now() + 10 * 60000); // OTP valid for 10 minutes

    // Send OTP via Message Central, passing the generated OTP in the message
    await axios.post(`https://cpaas.messagecentral.com/verification/v3/send?countryCode=91&customerId=${process.env.MESSAGE_CENTRAL_USER_ID}&flowType=SMS&mobileNumber=${phoneNumber}`, {
      message: `Your OTP is ${otp}`,  // Include the generated OTP in the message
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

    res.status(200).send({ success: true, message: 'OTP sent successfully', otp: otp });
  } catch (error) {
    console.error('Error sending OTP:', error.response ? error.response.data : error.message);
    res.status(500).send({ error: 'Failed to send OTP' });
  }
};

// Verify OTP
exports.verifyotp = async (req, res) => {
  const { phoneNumber, otp } = req.body;
  if (!phoneNumber || !otp) {
    return res.status(400).send({ error: 'Phone number and OTP are required' });
  }

  try {
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(400).send({ error: 'Phone number not found' });
    }
    if (user.otp !== otp || new Date() > user.otpExpiresAt) {
      return res.status(400).send({ error: 'Invalid or expired OTP' });
    }

    let fullnameExists = false;
    if (user.fullname) {
      fullnameExists = true;
    }

    // OTP is verified, now check if the user exists
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    res.status(200).send({
      success: true,
      message: 'OTP verified successfully',
      user: user,
      fullname: user?.fullname,
      username: user?.username,
      token: token,
      fullnameExists: fullnameExists, // true if user exists, false otherwise
    });
  } catch (error) {
    console.error('Error verifying OTP:', error.response ? error.response.data : error.message);
    res.status(500).send({ error: 'Failed to verify OTP' });
  }
};

// Send OTP via WhatsApp
exports.sendotpwhatsapp = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).send({ error: 'Phone number is required' });
  }

  try {
    const otp = generateSixDigitRandomNumber();  // Generate 6-digit OTP
    const otpExpiresAt = new Date(Date.now() + 10 * 60000); // OTP valid for 10 minutes

    const mediaUrl = 'https://dhorandjoy.s3-ap-southeast-1.amazonaws.com/your/subfolder/path/20246281352-239Prescription.pdf';

    // Send OTP via Message Central
    await axios.post(`https://cpaas.messagecentral.com/verification/v3/send?countryCode=91&customerId=${process.env.MESSAGE_CENTRAL_USER_ID}&flowType=SMS&mobileNumber=${phoneNumber}`, {
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
