const AWS = require('aws-sdk');

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,  // You can replace with hardcoded keys if needed
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Replace with your secret key
  region: 'ap-south-1' // Set your region
});

// Create a Rekognition client
const rekognition = new AWS.Rekognition();
const s3 = new AWS.S3();

// Controller function to detect gender
exports.detectGender = async (req, res) => {
//   const { imageName } = req.body;  // Assuming imageName is sent in the request body
const imageName = req.params.imageName;

  const params = {
    Image: {
      S3Object: {
        Bucket: 'kittybee',  // Use your bucket name
        Name: `frames/${imageName}`,  // The full key of the image in S3
      },
    },
    Attributes: ['ALL'],  // Retrieve all facial attributes including gender
  };

  try {
    const data = await rekognition.detectFaces(params).promise();

    if (data.FaceDetails.length > 0) {
      // Extract gender information
      const results = data.FaceDetails.map((faceDetail, index) => ({
        faceNumber: index + 1,
        gender: faceDetail.Gender ? faceDetail.Gender.Value : 'Not detected',
        confidence: faceDetail.Gender ? faceDetail.Gender.Confidence : 0,
      }));
    
    //   The gender has been detected so delete image from s3
    try {
        const data = await s3
          .deleteObject({
            Bucket: "kittybee",
            Key: `frames/${imageName}`, // Use backticks for template literals
          })
          .promise();
        console.log("Image deleted successfully:", data);
      } catch (error) {
        console.error("Error deleting image:", error);
      }
      



      return res.json({
        success: true,
        message: 'Gender detection successful',
        data: results,
      });
    } else {
      return res.json({
        success: false,
        message: 'No face detected in the image.',
      });
    }
  } catch (error) {
    console.error('Error detecting faces:', error);
    return res.status(500).json({
      success: false,
      message: 'Error detecting faces',
      error: error.message,
    });
  }
};
