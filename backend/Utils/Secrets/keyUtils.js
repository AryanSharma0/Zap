// keyUtils.js
const { generateKeyPairSync } = require("crypto");
const path = require("path");
const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require("@aws-sdk/client-secrets-manager");
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

module.exports = { generateRSAKeys };
