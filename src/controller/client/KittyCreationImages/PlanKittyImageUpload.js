const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const path = require('path');

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

exports.uploadKittyBanner = [upload.single('file'), async (req, res) => {
  console.log('The kitty banner upload triggered');
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileBuffer = req.file.buffer; // File data from Multer
    const timestamp = Date.now();
    const key = `kitty_banners/banner_${timestamp}${path.extname(req.file.originalname)}`;

    const params = {
      Bucket: 'kittybee',
      Key: key,
      Body: fileBuffer,
      ContentType: req.file.mimetype
    };

    const command = new PutObjectCommand(params);

    const result = await s3.send(command);
    console.log('Upload Success:', result);
    const imageUrl = `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;

    res.status(201).json({
      message: 'Upload Success',
      imageUrl, // Returning the URL of the uploaded file
      result
    });
        
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ message: err.message });
  }
}];