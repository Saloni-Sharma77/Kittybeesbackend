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
  
  // Validate if phoneNumber is provided
  if (!phoneNumber) {
    return res.status(400).send({ error: 'Phone number is required' });
  }

  try {
    // Make the request to the external API (MessageCentral) for sending OTP
    const axiosResponse = await axios.post(`https://cpaas.messagecentral.com/verification/v3/send?countryCode=91&customerId=${process.env.MESSAGE_CENTRAL_USER_ID}&flowType=SMS&mobileNumber=${phoneNumber}`, 
      {},
      {
        headers: {
          'authToken': process.env.MESSAGE_CENTRAL_AUTH_TOKEN
        }
      }
    );

    // Log the response from the external API (for debugging if needed)
    console.log('Response from MessageCentral:', axiosResponse.data);

    // Filter to update or create user with the phone number
    const filter = { phoneNumber };

    // Update the user document with the phone number or insert if not found
    const update = { $set: { phoneNumber } };
    const options = { upsert: true, new: true };
    await User.findOneAndUpdate(filter, update, options);

    // Return the actual response from the external API to the client
    res.status(200).send({
      success: true,
      message: 'OTP sent successfully',
      data: axiosResponse.data  // Send the response data from the API
    });
  } catch (error) {
    console.error('Error sending OTP:', error.response ? error.response.data : error.message);
    res.status(500).send({ error: error.response ? error.response.data : 'Failed to send OTP' });
  }
};


// Verify OTP



// Verify OTP via Message Central
exports.verifyotptest = async (req, res) => {
  const { phoneNumber, otp ,customerId,verificationId} = req.body;

  if (!phoneNumber || !otp || !customerId || !verificationId) {
    return res.status(400).send({ error: 'Phone number, customerId,verificationId and OTP are required' });
  }

  try {
    const otpRecord = await User.findOne({ phoneNumber });

    // Check if OTP record exists
    if (!otpRecord) {
      return res.status(400).send({ error: 'Phone number not found or no OTP request made' });
    }

    // Validate OTP using Message Central
    const response = await axios.get(
      `https://cpaas.messagecentral.com/verification/v3/validateOtp?countryCode=91&mobileNumber=${phoneNumber}&customerId=${customerId}$
      verificationId=
      ${verificationId}&flowType=SMS`,
      {
        headers: {
          'authToken': process.env.MESSAGE_CENTRAL_AUTH_TOKEN
        }
      }
    );

    if (response.data.status !== 'SUCCESS') {
      return res.status(400).send({ error: 'Invalid or expired OTP' });
    }

    // OTP is verified
    const token = jwt.sign({ phoneNumber }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).send({
      success: true,
      message: 'OTP verified successfully',
      token: token,
      data :response.data
    });
  } catch (error) {
    console.error('Error verifying OTP:', error.response ? error.response.data : error.message);
    res.status(500).send({ error: error });
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
