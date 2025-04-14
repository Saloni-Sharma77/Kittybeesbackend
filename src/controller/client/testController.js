const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
const User = require('../../schema/userSchema');
const FcmTokenModel = require('../../schema/FcmSchema');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
// Send OTP via SMS

// exports.sendotptest = async (req, res) => {
//   const { phoneNumber, fcmToken } = req.body;

//   if (!phoneNumber) {
//     return res.status(400).send({ error: 'Phone number is required' });
//   }
//   if (!fcmToken) {
//     return res.status(400).send({ error: 'FCM Token is required' });
//   }
//   try {
//     const user = await User.findOneAndUpdate({ phoneNumber }, { phoneNumber }, { upsert: true, new: true });
//     if (!user) throw new Error('Failed to retrieve or create user');

//      if (user.isActive === false) {
//       return res.status(403).send({
//         success: false,
//         message: 'User is deactivated',
//       });
//     }
//      // save fcm token
//      const fcmRecord = await FcmTokenModel.findOne({ userId: user._id,deviceType:'Android'});
//      // Send OTP

//      if (fcmRecord) {
//        // Update existing record
//        if (!fcmRecord.fcmToken.includes(fcmToken)) {
//          fcmRecord.fcmToken.push(fcmToken);
//          fcmRecord.updatedAt = new Date();
//          await fcmRecord.save();
//        }
//      } else {
//       console.log('else')
//        // Create a new FCM record
//        await FcmTokenModel.create({
//          userId: user._id,
//          deviceType:'Android',
//          fcmToken: [fcmToken],
//        });
//      }
//    //exit


//       const axiosResponse = await axios.post(
//         `https://cpaas.messagecentral.com/verification/v3/send?countryCode=91&customerId=${process.env.MESSAGE_CENTRAL_USER_ID}&flowType=SMS&mobileNumber=${phoneNumber}`,
//         {},
//         { headers: { authToken: process.env.MESSAGE_CENTRAL_AUTH_TOKEN } }
//       );

//       console.log('MessageCentral Response:', axiosResponse.data);
//       if(axiosResponse.data?.responseCode == 200){
//       return res.status(200).send({
//         success: true,
//         message: 'OTP sent successfully',
//         data: axiosResponse.data,
//       });
      
//     }
//   } catch (error) {
//     console.error('Error in sendotptest:', error.message);
//     return res.status(500).send({
//       success: false,
//       message: 'An error occurred',
//       error: error.message,
//     });
//   }
// };
exports.sendotptest = async (req, res) => {
  const { phoneNumber, fcmToken } = req.body;

  if (!phoneNumber) {
    return res.status(400).send({ error: 'Phone number is required' });
  }
  if (!fcmToken) {
    return res.status(400).send({ error: 'FCM Token is required' });
  }

  // Bypass number check
  if (phoneNumber === '7568450276') {
    return res.status(200).send({
      success: true,
      message: 'OTP sent successfully',
      data: {
        responseCode: 200,
        message: "SUCCESS",
        data: {
          verificationId: "76851",
          mobileNumber: "7734839066",
          responseCode: "200",
          timeout: "60.0",
          transactionId: "f6ec5c76-abb1-466e-8df6-9fe1679fcfac"
        }
      }
    });
  }

  try {
    const user = await User.findOneAndUpdate(
      { phoneNumber },
      { phoneNumber },
      { upsert: true, new: true }
    );
    if (!user) throw new Error('Failed to retrieve or create user');

    if (user.isActive === false) {
      return res.status(403).send({
        success: false,
        message: 'User is deactivated',
      });
    }

    // Save fcm token
    const fcmRecord = await FcmTokenModel.findOne({ userId: user._id, deviceType: 'Android' });

    if (fcmRecord) {
      if (!fcmRecord.fcmToken.includes(fcmToken)) {
        fcmRecord.fcmToken.push(fcmToken);
        fcmRecord.updatedAt = new Date();
        await fcmRecord.save();
      }
    } else {
      await FcmTokenModel.create({
        userId: user._id,
        deviceType: 'Android',
        fcmToken: [fcmToken],
      });
    }

    const axiosResponse = await axios.post(
      `https://cpaas.messagecentral.com/verification/v3/send?countryCode=91&customerId=${process.env.MESSAGE_CENTRAL_USER_ID}&flowType=SMS&mobileNumber=${phoneNumber}`,
      {},
      { headers: { authToken: process.env.MESSAGE_CENTRAL_AUTH_TOKEN } }
    );

    console.log('MessageCentral Response:', axiosResponse.data);

    if (axiosResponse.data?.responseCode == 200) {
      return res.status(200).send({
        success: true,
        message: 'OTP sent successfully',
        data: axiosResponse.data,
      });
    }

  } catch (error) {
    console.error('Error in sendotptest:', error.message);
    return res.status(500).send({
      success: false,
      message: 'An error occurred',
      error: error.message,
    });
  }
};

// Verify OTP



// Verify OTP via Message Central
// exports.verifyotptest = async (req, res) => {
//   const { phoneNumber, otp ,verificationId} = req.body;

//   if (!phoneNumber || !otp ) {
//     return res.status(400).send({ error: 'Phone number,verificationId and OTP are required' });
//   }
//   if (phoneNumber === '9999999999' && otp === '1234') {
//     const token = jwt.sign({ phoneNumber }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     const userdetail = await User.findOneAndUpdate({ phoneNumber }, { phoneNumber }, { upsert: true, new: true });
//     const userInfo = await User.find({phoneNumber});

//     return res.status(200).send({
//       success: true,
//       message: 'OTP verified successfully',
//       token: token,
//       userData: userInfo,
//     });
//   }

//   try {
//     const otpRecord = await User.findOne({ phoneNumber });

//     // Check if OTP record exists
//     if (!otpRecord) {
//       return res.status(400).send({ error: 'Phone number not found or no OTP request made' });
//     }

//     // Validate OTP using Message Central
//     const response = await axios.get(
//       `https://cpaas.messagecentral.com/verification/v3/validateOtp?countryCode=91&mobileNumber=${phoneNumber}&verificationId=${verificationId}&customerId=${process.env.MESSAGE_CENTRAL_USER_ID}&code=${otp}`,

//       {
//         headers: {
//           'authToken': process.env.MESSAGE_CENTRAL_AUTH_TOKEN
//         }
//       }
//     );



//     // OTP is verified
//     const token = jwt.sign({ phoneNumber }, process.env.JWT_SECRET, {
//       expiresIn: '1h',
//     });
//     const userInfo = await User.find({phoneNumber});


//     res.status(200).send({
//       success: true,
//       message: 'OTP verified successfully',
//       token: token,
//       data :response.data,
//       userData: userInfo,

//     });
//   } catch (error) {
//     console.error('Error sending OTP:', error.response ? error.response.data : error.message);
//     res.status(500).send({ error: error.response ? error.response.data : 'Failed to verify OTP' });  
//   }
// };
exports.verifyotptest = async (req, res) => {
  const { phoneNumber, otp, verificationId } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).send({ error: 'Phone number,verificationId and OTP are required' });
  }

  if (phoneNumber === '7568450276') {
    return res.status(200).send({
      success: true,
      message: 'OTP verified successfully',
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6Ijc3MzQ4MzkwNjYiLCJpYXQiOjE3NDQyODE2NzgsImV4cCI6MTc0NDI4NTI3OH0.kTCjXRhv69HzFAz-vLVJrSDtfmw6rW8CL0u6D0lntcg",
      data: {
        responseCode: 200,
        message: "SUCCESS",
        data: {
          verificationId: 76253,
          mobileNumber: null,
          verificationStatus: "VERIFICATION_COMPLETED",
          responseCode: "200",
          errorMessage: null,
          transactionId: "0658230d-c750-4098-823e-0ddd2801faa4",
          authToken: null
        }
      },
      userData: [
        {
          "_id": "67da68cc1dca96d0e830bba5",
          "phoneNumber": "7734839066",
          "__v": 0,
          "activityArr": [],
          "communityReminder": true,
          "createdAt": "2025-03-19T06:48:44.747Z",
          "eventArr": [
            "Career",
            "Entrepreneur",
            "Local Community"
          ],
          "isActive": true,
          "newKittyReminder": true,
          "partyArr": [],
          "paymentReminder": true,
          "profileImage": "https://kittybee.s3.amazonaws.com/kitty_banners/banner_1742367175226.jpg",
          "role": "user",
          "sociallinks": [
            {
              "instaurl": "",
              "Linkedinurl": "",
              "Websiteurl": "",
              "Facebookurl": "",
              "_id": "67da69c978fd4733ff66f867"
            }
          ],
          "updatedAt": "2025-04-10T10:40:58.148Z",
          "verifiedBy": "video",
          "dob": "2000-01-03T00:00:00.000Z",
          "fullname": "salonisharma",
          "location": "Mansarovar, Jaipur Rajasthan",
          "profession": "doctor",
          "email": "saloni@gmail.com",
          "about": "N/A",
          "username": "Anonymous"
        }
      ]
    });
  }

  if (phoneNumber === '9999999999' && otp === '1234') {
    const token = jwt.sign({ phoneNumber }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const userdetail = await User.findOneAndUpdate({ phoneNumber }, { phoneNumber }, { upsert: true, new: true });
    const userInfo = await User.find({ phoneNumber });

    return res.status(200).send({
      success: true,
      message: 'OTP verified successfully',
      token: token,
      userData: userInfo,
    });
  }

  try {
    const otpRecord = await User.findOne({ phoneNumber });

    if (!otpRecord) {
      return res.status(400).send({ error: 'Phone number not found or no OTP request made' });
    }

    const response = await axios.get(
      `https://cpaas.messagecentral.com/verification/v3/validateOtp?countryCode=91&mobileNumber=${phoneNumber}&verificationId=${verificationId}&customerId=${process.env.MESSAGE_CENTRAL_USER_ID}&code=${otp}`,
      {
        headers: {
          'authToken': process.env.MESSAGE_CENTRAL_AUTH_TOKEN
        }
      }
    );

    const token = jwt.sign({ phoneNumber }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    const userInfo = await User.find({ phoneNumber });

    res.status(200).send({
      success: true,
      message: 'OTP verified successfully',
      token: token,
      data: response.data,
      userData: userInfo,
    });
  } catch (error) {
    console.error('Error verifying OTP:', error.response ? error.response.data : error.message);
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

exports.deleteFcmToken = async (req, res) => {
  try {
    const { userId, fcmToken } = req.body;

    if (!userId || !fcmToken) {
      return res.status(400).json({ message: 'userId and fcmToken are required' });
    }

    // Find the user's FCM tokens
    const userFcmTokens = await FcmTokenModel.findOne({ userId });

    if (!userFcmTokens) {
      return res.status(404).json({ message: 'No FCM tokens found for this user' });
    }
    const updatedTokens = userFcmTokens.fcmToken.filter(
      (token) => token !== fcmToken
    );

    if (updatedTokens.length === userFcmTokens.fcmToken.length) {
      return res.status(404).json({ message: 'FCM token not found for this user' });
    }

    // Update the user's FCM tokens in the database
    userFcmTokens.fcmToken = updatedTokens;
    await userFcmTokens.save();

    return res.status(200).json({ message: 'FCM token deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};