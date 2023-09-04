const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const authenticator = require("../middleware/authenticator");
const Profile = require("../models/Profile");
const User = require("../models/User");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

// Get profile by user ID
router.get("/:userId", authenticator, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.userId });

    if (!profile) {
      return res.status(404).json({ msg: "Profile not found" });
    }

    // Check if the authenticated user is the profile owner
    const user = await User.findById(req.user.id).select("name");
    if (!user) {
      return res
        .status(401)
        .json({ msg: "Not authorized to access this profile" });
    }

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// Update profile
router.put(
  "/",
  authenticator,
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("about", "About field is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      const user = await User.findById(req.user.id);

      if (!profile) {
        return res.status(404).json({ msg: "Profile not found" });
      }

      // Check if the authenticated user is the profile owner
      if (profile.user.toString() !== req.user.id) {
        return res
          .status(401)
          .json({ msg: "Not authorized to update this profile" });
      }
      user.name = req.body.name;
      profile.name = req.body.name;
      profile.about = req.body.about;

      await profile.save();
      await user.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

// Route for blocking account
router.post(
  "/blockaccount/:accountToBlockId",
  authenticator,
  async (req, res) => {
    try {
      const accountToBlockId = req.params.accountToBlockId;
      const userId = req.user.id;
      // Check if account to be blocked exist or not
      const userExist = await User.findById(accountToBlockId);
      if (!userExist) {
        return res.status(404).json({ message: "User profile not found" });
      }
      // Check if the user profile exists
      const userProfile = await Profile.findOne({ user: userId });
      if (!userProfile) {
        return res.status(404).json({ message: "User profile not found" });
      }

      // Check if the account to block exists
      const accountToBlockProfile = await Profile.findOne({
        user: accountToBlockId,
      });

      if (!accountToBlockProfile) {
        return res.status(404).json({ message: "Account to block not found" });
      }

      // Add the account to the blocked accounts list
      if (!userProfile.blockedUsers.includes(accountToBlockId)) {
        userProfile.blockedUsers.push(accountToBlockId);
        await userProfile.save();
      }

      res.json({ message: "Account blocked successfully" });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

// Route for unblocking account
router.post(
  "/unblockAccount/:accountToUnblockId",
  authenticator,
  async (req, res) => {
    try {
      const accountToUnblockId = req.params.accountToUnblockId;
      const userId = req.user.id;

      // Check if the user profile exists
      const userProfile = await Profile.findOne({ user: userId });

      if (!userProfile) {
        return res.status(404).json({ message: "User profile not found" });
      }

      // Check if the account to unblock exists
      const accountToUnblockProfile = await Profile.findOne({
        user: accountToUnblockId,
      });

      if (!accountToUnblockProfile) {
        return res
          .status(404)
          .json({ message: "Account to unblock not found" });
      }

      // Remove the account from the blocked accounts list
      const index = userProfile.blockedUsers.indexOf(accountToUnblockId);

      if (index !== -1) {
        userProfile.blockedUsers.splice(index, 1);
        await userProfile.save();
      }

      res.json({ message: "Account unblocked successfully" });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

// Routes for adding notification
router.post("/notification/:messageId", authenticator, async (req, res) => {
  const { messageId } = req.params;
  try {
    // Fetching message
    const message = await Message.findById(messageId);
    if (!message) {
      res.status(404).json("");
    }
    // Checking for authentication of user for that message
    const authenticatedUser =
      message.sender === req.user.id.toString() ||
      message.receiver.toString() === req.user.id.toString();
    if (!authenticatedUser) {
      res.status(404).json("You are not authorised");
    }
    // Fetching user profile
    let userProfile = await Profile.findOne({ user: req.user.id });
    if (!userProfile) {
      res.status(400).json("User not found");
    }
    if (authenticatedUser && userProfile) {
      // Pushing the data
      const exist = userProfile.notification.some(
        (ele) => ele.toString() === messageId
      );

      !exist && userProfile.notification.push(message._id);
    }
    await userProfile.save();
    res.json("notification");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// Routes for removing notificaton
router.delete(
  "/notification/:conversationId",
  authenticator,
  async (req, res) => {
    const conversationId = req.params.conversationId;
    try {
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        res.status(404).json("");
      }
      const authenticatedUser = conversation.participants.some(
        (ele) => ele.toString() === req.user.id.toString()
      );
      if (!authenticatedUser) {
        res.status(404).json("You are not authorised");
      }
      let userProfile = await Profile.findOne({ user: req.user.id })
        .populate({
          path: "notification",
          select: "conversation", // Include only the "name" field from the User collection
        })
        .exec();
      if (!userProfile) {
        res.status(400).json("User not found");
      }
      const leftnotification = userProfile.notification.filter(
        (ele) => ele?.conversation.toString() !== conversation._id.toString()
      );
      userProfile.notification = leftnotification;
      await userProfile.save();
      res.json("viewed");
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

// Routes for fetching notificaton
router.get("/notification/get", authenticator, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })
      .populate({
        path: "notification",
        select: "conversation", // Include only the "name" field from the User collection
      })
      .exec();

    if (!profile) {
      res.status(400).json("User not found");
    }
    const notifications = profile.notification;
    const uniqueNotifications = [];
    notifications.filter((item) => {
      if (
        !uniqueNotifications.some(
          (ele) => ele._id.toString() === item._id.toString()
        )
      ) {
        uniqueNotifications.push(item);
        return true;
      }
      return false;
    });
    profile.notification = uniqueNotifications;
    profile.save();
    res.json(uniqueNotifications);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
