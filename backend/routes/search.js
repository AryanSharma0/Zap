const express = require("express");
const router = express.Router();
const authenticator = require("../middleware/authenticator");
const Profile = require("../models/Profile");

// Search for users matching the query
router.get("/:query", authenticator, async (req, res) => {
  try {
    const query = req.params.query;
    const users = await Profile.find({
      $or: [
        { username: { $regex: query, $options: "i" } }, // Case-insensitive username search
        { phoneNumber: { $regex: query, $options: "i" } }, // Case-insensitive phone number search
      ],
      user: { $nin: req.user.id },
    }).limit(10); // Limit the results to 10 users

    res.json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});
module.exports = router;
