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
   const userInfo = await User.findOneAndUpdate(filter, update, options);

    // Return the actual response from the external API to the client
    res.status(200).send({
      success: true,
      message: 'OTP sent successfully',
      data: axiosResponse.data , // Send the response data from the API
      uerData: userInfo,
    });
  } catch (error) {
    console.error('Error sending OTP:', error.response ? error.response.data : error.message);
    res.status(500).send({ error: error.response ? error.response.data : 'Failed to send OTP' });
  }
};


// Verify OTP



// Verify OTP via Message Central
exports.verifyotptest = async (req, res) => {
  const { phoneNumber, otp ,verificationId} = req.body;

  if (!phoneNumber || !otp  || !verificationId) {
    return res.status(400).send({ error: 'Phone number,verificationId and OTP are required' });
  }

  try {
    const otpRecord = await User.findOne({ phoneNumber });

    // Check if OTP record exists
    if (!otpRecord) {
      return res.status(400).send({ error: 'Phone number not found or no OTP request made' });
    }

    // Validate OTP using Message Central
    const response = await axios.get(
      `https://cpaas.messagecentral.com/verification/v3/validateOtp?countryCode=91&mobileNumber=${phoneNumber}&verificationId=${verificationId}&customerId=${process.env.MESSAGE_CENTRAL_USER_ID}&code=${otp}`,

      {
        headers: {
          'authToken': process.env.MESSAGE_CENTRAL_AUTH_TOKEN
        }
      }
    );



    // OTP is verified
    const token = jwt.sign({ phoneNumber }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    const userInfo = await User.find({phoneNumber});


    res.status(200).send({
      success: true,
      message: 'OTP verified successfully',
      token: token,
      data :response.data,
      uerData: userInfo,

    });
  } catch (error) {
    console.error('Error sending OTP:', error.response ? error.response.data : error.message);
    res.status(500).send({ error: error.response ? error.response.data : 'Failed to verify OTP' });  
  }
};

// Send OTP via WhatsApp
exports.sendotptestwhatsapp = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).send({ error: 'Phone number is required' });
  }

  try {
  


    // Send OTP via Message Central
    const axiosResponse =  await axios.post(`https://cpaas.messagecentral.com/verification/v3/send?countryCode=91&customerId=${process.env.MESSAGE_CENTRAL_USER_ID}&flowType=WHATSAPP&mobileNumber=${phoneNumber}`, {
    }, {
      headers: {
        'authToken': process.env.MESSAGE_CENTRAL_AUTH_TOKEN,
      }
    });

    console.log('Response from MessageCentral:', axiosResponse.data);

    // Filter to update or create user with the phone number
    const filter = { phoneNumber };

    // Update the user document with the phone number or insert if not found
    const update = { $set: { phoneNumber } };
    const options = { upsert: true, new: true };
   const userInfo = await User.findOneAndUpdate(filter, update, options);

    // Return the actual response from the external API to the client
    res.status(200).send({
      success: true,
      message: 'OTP sent successfully',
      data: axiosResponse.data , // Send the response data from the API
      uerData: userInfo,
    });
    // Update or insert user OTP data

  } catch (error) {
    console.error('Error sending OTP via WhatsApp:', error.response ? error.response.data : error.message);
    res.status(500).send({ error: 'Failed to send OTP' });
  }
};
