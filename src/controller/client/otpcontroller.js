const dotenv = require("dotenv");
dotenv.config();
const User = require("../../schema/userSchema");
const axios = require("axios"); // Ensure axios is installed and required
const jwt = require("jsonwebtoken");

const messageCentralApiKey = process.env.MESSAGE_CENTRAL_API_KEY;
const messageCentralCustomerId = process.env.MESSAGE_CENTRAL_CUSTOMER_ID;
const messageCentralAuthToken = process.env.MESSAGE_CENTRAL_AUTH_TOKEN;

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

  if (!phoneNumber) {
    return res.status(400).send({ error: "Phone number is required" });
  }

  try {
    const otp = generateSixDigitRandomNumber();
    const otpExpiresAt = new Date(Date.now() + 10 * 60000); // 10 minutes expiration

    // Send OTP via Message Central
    const response = await axios.post('https://api.messagecentral.com/send', {
      apiKey: messageCentralApiKey,
      customerId: messageCentralCustomerId,
      authToken: messageCentralAuthToken,
      to: phoneNumber,
      message: `Your OTP is ${otp}`,
    });

    console.log("Message Central API Response:", response.data);

    if (response.data.success) {
      const filter = { phoneNumber };
      const update = { otp, otpExpiresAt };
      const options = { upsert: true, new: true };
      const updatedUser = await User.findOneAndUpdate(filter, update, options);

      res.status(200).send({ success: true, message: "OTP sent successfully", otp });
    } else {
      res.status(500).send({ error: "Failed to send OTP", details: response.data });
    }
  } catch (error) {
    console.error("Error sending OTP:", error.message);
    res.status(500).send({ error: "Failed to send OTP", details: error.message });
  }
};


// Verify OTP
exports.verifyotp = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
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

    let fullnameExists = !!user.fullname;

    // OTP is verified, now create a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Clear OTP data from user
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    res.status(200).send({
      success: true,
      message: "OTP verified successfully",
      user: user,
      fullname: user.fullname,
      username: user.username,
      token: token,
      fullnameExists: fullnameExists
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).send({ error: "Failed to verify OTP" });
  }
};

// Send OTP via WhatsApp
exports.sendotpwhatsapp = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).send({ error: "Phone number is required" });
  }

  try {
    const otp = generateSixDigitRandomNumber();
    const otpExpiresAt = new Date(Date.now() + 10 * 60000); // 10 minutes expiration

    // Send OTP via Message Central
    await axios.post('https://api.messagecentral.com/send', {
      apiKey: messageCentralApiKey,
      customerId: messageCentralCustomerId,
      authToken: messageCentralAuthToken,
      to: `whatsapp:${phoneNumber}`,
      body: `Your OTP is ${otp}`,
      mediaUrl: 'https://dhorandjoy.s3-ap-southeast-1.amazonaws.com/your/subfolder/path/20246281352-239Prescription.pdf',
      // Adjust parameters according to Message Central's API requirements
    });

    // Update or insert user OTP data
    const filter = { phoneNumber };
    const update = { otp, otpExpiresAt };
    const options = { upsert: true, new: true };
    const updatedUser = await User.findOneAndUpdate(filter, update, options);

    res.status(200).send({ success: true, message: "OTP sent successfully", updatedUser: updatedUser, otp: otp });
  } catch (error) {
    console.error("Error sending OTP via WhatsApp:", error);
    res.status(500).send({ error: "Failed to send OTP" });
  }
};
