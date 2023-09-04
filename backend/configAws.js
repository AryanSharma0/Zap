// awsConfig.js
const { S3Client } = require("@aws-sdk/client-s3");

require("dotenv").config();

// Set your AWS credentials
const config = {
  credential: {
    accessKeyId: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY_ID,
  },
  region: "ap-south-1", // Rep  lace with your AWS region
};
const s3 = new S3Client(config);

module.exports = s3;
   


