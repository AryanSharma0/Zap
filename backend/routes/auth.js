const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Profile = require("../models/Profile");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticator = require("../middleware/authenticator");
const path = require("path");
const crypto = require("crypto");
const readExploit = require("../Utils/FileRead/readExploit");
const {
  generateRSAKeys,
  saveKeysToS3,
  // getKeysFromS3,
} = require("../Utils/Secrets/keyUtils");
const envPath = path.resolve(__dirname, "../.env");
require("dotenv").config({ path: envPath });

// const JWT_SECRET = process.env.REACT_APP_JWT_SECRET_KEY;

//Route 1: Create a uset using: POST "/api/auth/createuser"
module.exports = () => {
  router.post(
    "/createuser",
    [
      body("name", "Enter a valid name").isLength({ min: 3 }),
      body("password", "Password must be atleast 8 character").isLength({
        min: 8,
      }),
      body("username", "Username must be atleast 3 character").isLength({
        min: 3,
      }),
      body("phoneNumber", "Username must be atleast 10 character").isLength({
        min: 10,
      }),
    ],
    async (req, res) => {
      // If there are errors retrurn bad request and errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // If password is present in exploited db

      const exploited = await readExploit(req.body.password);
      if (exploited) {
        return res.status(404).json({ exploited: true });
      }

      try {
        // Check whether the user with this phone number already exists
        let user = await User.findOne({ phoneNumber: req.body.phoneNumber });
        if (user) {
          return res
            .status(400)
            .json({ errors: [{ msg: "User already exists" }] });
        }

        // Generate RSA keys
        const { publicKey, privateKey } = generateRSAKeys();

        // Save public key to the database along with other user information
        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(req.body.password, salt);

        user = await User.create({
          name: req.body.name,
          password: hashpassword,
          phoneNumber: req.body.phoneNumber,
          username: req.body.username,
          publicKey,
        });

        await Profile.create({
          user: user._id,
          phoneNumber: req.body.phoneNumber,
          name: req.body.name,
          about: req.body.about,
          username: req.body.username,
        });

        const JWT_SECRET = crypto.randomBytes(32).toString("hex");
        console.log(JWT_SECRET);

        // Save the private key to AWS S3
        await saveKeysToS3(user._id.toString(), JWT_SECRET, privateKey);

        const data = {
          user: {
            id: user.id,
          },
        };
        const authToken = jwt.sign(data, JWT_SECRET, { expiresIn: "12h" });

        res.json({ authToken });
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Some error occured ");
      }
    }
  );

  // Route 2: Authenticate  a user using: POST "/api/auth/login"
  router.post(
    "/login",
    [
      body("identifier", "Identifier must be atleast 3 character").isLength({
        min: 3,
      }),
      body("password", "Password must be atleast 5 character").isLength({
        min: 5,
      }),
    ],

    async (req, res) => {
      // If there are errors, return Bad request and the errors
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { identifier, password } = req.body;
      try {
        let user;
        const phoneRegex = /^\d{10}$/; // Assumes a 10-digit phone number format
        if (phoneRegex.test(identifier)) {
          user = await User.findOne({ phoneNumber: identifier });
        } else {
          user = await User.findOne({ username: identifier });
        }
        if (!user) {
          return res
            .status(400)
            .json({ error: "Please try to connect with correct credentials." });
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
          return res
            .status(400)
            .json({ error: "Please try to connect with correct credentials" });
        }
        const data = {
          user: {
            id: user.id,
          },
        };

        // Fetching JWT Secret key from backend
        // const { jwtSecret } = getKeysFromS3(user._id.toString());
        const jwtSecret = "IamagoodCoder";
        const authToken = jwt.sign(data, jwtSecret, { expiresIn: "12h" });
        res.json(authToken);
      } catch (err) {
        res.status(500).json({ error: "Internal server Error" });
      }
    }
  );

  // Route 3: Check if username exists
  router.get("/checkUsername/:username", async (req, res) => {
    try {
      let { username } = req.params;

      // Check if the username is empty or contains only whitespace
      if (!username.trim()) {
        return res.status(400).send({ error: "Empty spaces are not allowed" });
      }

      // Check if the username contains only alphanumeric characters
      const alphanumericRegex = /^[a-zA-Z0-9]+$/;
      if (!alphanumericRegex.test(username)) {
        return res
          .status(400)
          .send({ error: "Only alphabets and numbers are allowed" });
      }
      const spacesRegex = /^[a-zA-Z0-9]+$/;
      if (!spacesRegex.test(username.replace(/\s/g, ""))) {
        return res.status(400).send({ error: "No spaces  are allowed" });
      }

      const profile = await Profile.findOne({ username });

      if (profile) {
        return res.json({ exists: true });
      } else {
        return res.json({ exists: false });
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  });

  // Route 4: Get User self Profile data
  router.get("/getuserProfile", authenticator, async (req, res) => {
    const userId = req.user.id;
    try {
      const user = await Profile.findOne({ user: userId });
      // Check if the authenticated user is the profile owner
      if (!user) {
        res.status(404).send("user not found");
      }

      res.json(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  });
  return router;
};
