const {
  SecretsManagerClient,
  ListSecretsCommand,
  GetSecretValueCommand,
} = require("@aws-sdk/client-secrets-manager");
const path = require("path");
const envPath = path.resolve(__dirname, "../.env");
require("dotenv").config({ path: envPath });

const client = new SecretsManagerClient({
  service: "secretsManager",
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY_ID,
  },
  region: "ap-south-1",
});

const secret_name = "secrete/keys";

let response;
const fetch = async () => {
  try {
    response = await client.send(
      new GetSecretValueCommand({
        SecretId: secret_name,
        VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
      })
    );
  } catch (error) {
    console.log(error);
  }

  const secret = response;

  console.log(secret); 
}; 
fetch();
console.log("Yes");

// const awsSecretsManagerClient = new SecretsManagerClient(awsConfig);

// // Create a GetSecretValueCommand object
// const getSecretValueCommand = new GetSecretValueCommand({
//   SecretId: "prod/AppBeta/Mysql",
// });

// // Call the send() method to retrieve the secret value
// awsSecretsManagerClient
//   .send(getSecretValueCommand)
//   .then((response) => {
//     // The secret value is returned in the response.SecretString property
//     console.log(response.SecretString);
//   })
//   .catch(console.error);
