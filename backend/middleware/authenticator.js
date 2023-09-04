const jwt = require("jsonwebtoken");

require("dotenv").config();

const JWT_SECRET = process.env.REACT_APP_JWT_SECRET_KEY;

const authenticator = (req, res, next) => {
  // Get the user from the jwt token and add id to req object
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "Please authenticate using valid token" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({
      error: "Login session has been expired or Login token is invalid",
    });
  }
};

module.exports = authenticator;
