const AWS = require("aws-sdk");
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const path = require('path');
const axios = require('axios');

// Create an S3 client
const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  region: 'ap-south-1' // Replace with your AWS region
});


// Set up Multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

// Middleware to handle file upload
exports.uploadImage = [upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileBuffer = req.file.buffer; // File data from Multer
    const timestamp = Date.now();
    const key = `image_${timestamp}${path.extname(req.file.originalname)}`;

    const params = {
      Bucket: 'kittybee',
      Key: `frames/${key}`,
      Body: fileBuffer,
      ContentType: req.file.mimetype
    };

    const command = new PutObjectCommand(params);

    const result = await s3.send(command);
    // console.log('Upload Success:', result);
    // res.status(201).json(result);
    if (result) {    
    const requestUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    const modifiedUrl = requestUrl.replace('/postImage', '');
    console.log('The requested url is ',modifiedUrl)
    const response = await axios.get(`${modifiedUrl}/detectGender/${key}`)


    console.log('The response is ',response.data)
    res.status(201).json(response.data);
    }

    
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ message: err.message });
  }
}];
