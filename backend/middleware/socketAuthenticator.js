const jwt = require("jsonwebtoken");
// const { JWT_SECRET } = require("./config"); // Import your JWT secret from the config file

require("dotenv").config();

const JWT_SECRET = process.env.REACT_APP_JWT_SECRET_KEY;

function socketAuthenticator(socket, next) {
  const token = socket.handshake.auth["auth-token"];
  if (!token) {
    return next(new Error("Please authenticate using a valid token"));
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    socket.userId = data.user; // Storing the user ID on the socket object for future use
    next();
  } catch (error) {
    return next(new Error("Please authenticate using a valid token"));
  }
}

module.exports = socketAuthenticator;
