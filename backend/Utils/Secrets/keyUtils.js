// keyUtils.js
const s3 = require("../../configAws");
const { generateKeyPairSync } = require("crypto");
const path = require("path");
const {
  SecretsManagerClient,
  GetSecretValueCommand,
}=require("@aws-sdk/client-secrets-manager");
const envPath = path.resolve(__dirname, "../.env");
require("dotenv").config({ path: envPath });

// Function to generate RSA key pair
function generateRSAKeys() {
  const { publicKey, privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });

  return { publicKey, privateKey };
}

// Function to save RSA keys to AWS S3
async function saveKeysToS3(userId, JWT_SECRET, privateKey) {
  try {
    // Create a new user folder in S3
    const params = {
      Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
      Key: `User/${userId}/keys.json`, // You can choose a different file name or format
      Body: JSON.stringify({
        privateKey: privateKey,
        jwtSecret: JWT_SECRET,
      }),
      sse: {
        // Specify the SSE algorithm to use
        sseAlgorithm: "AES256",
      },
    };
    await s3.putObject(params).promise();
  } catch (err) {
    throw new Error("Failed to save keys to S3");
  }
}

// Function to fetch RSA and JWT keys from AWS S3
async function getKeysFromS3(userId) {
  try {
    // const keysParams = {
    //   Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
    //   Key: `User/${userId}/keys.json`,
    //   sse: {
    //     // Specify the SSE algorithm to use
    //     sseAlgorithm: "AES256",
    //   },
    // };

    // const keysResponse = await s3.listObjectsV3(keysParams).promise();
    // console.log(keysResponse);
    // const keysData = JSON.parse(keysResponse.Body.toString());
    // const { privateKey, jwtSecret } = keysData;
    // return { privateKey, jwtSecret };  
    const client = new SecretsManagerClient({
      credential: {
        accessKeyId: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY_ID,
      },
      region: "ap-south-1",
    });

    let response;

    try {
      const secret_name = "prod/AppBeta/Mysql";

      response = await client.send(
        new GetSecretValueCommand({
          SecretId: secret_name,
          VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
        })
      );
    } catch (error) {
      // For a list of exceptions thrown, see
      // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
      throw error;
    }

    const secret = response.SecretString;
    console.log(secret);
    
 
  } catch (err) {
    throw new Error("Failed to fetch keys from S3");
  }
}

module.exports = { generateRSAKeys, saveKeysToS3, getKeysFromS3 };
