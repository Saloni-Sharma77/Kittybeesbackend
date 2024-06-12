const express = require('express');
const cors = require('cors');
const { generateOtp } = require('./src/controller/LoginusingOTP/otpcontroller');
const { sendOtpSms } = require('./src/controller/LoginusingOTP/sendotp');
const { storeOtp, verifyOtp } = require('./src/controller/LoginusingOTP/sendotp');

const port = process.env.PORT || 3000;


const app = express();


// app.use(bodyParser.json());
const server = app.listen(port, () => {
  console.log(`Your server is running on port ${port}`);
});



require('./src/config/db');
const routes = require('./src/routes/routes');

app.use(express.json());
app.use(cors());
app.use('/', routes);







