const express = require("express");
const router = express.Router();
const authenticator = require("../middleware/authenticator");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const Profile = require("../models/Profile");
const { mongoose } = require("mongoose");
const { default: axios } = require("axios");
const Analysis = require("../models/Analysis");
const Summary = require("../models/Summary");

module.exports = () => {
  // Fetch all conversations
  router.get("/", authenticator, async (req, res) => {
    try {
      const conversations = await Conversation.find({
        participants: req.user.id,
        deletedBy: { $ne: req.user.id },
      })
        .populate({
          path: "lastMessage",
          select: "content deletedBy createdAt", // Include only the "name" field from the User collection
        })
        .populate({
          path: "participants",
          select: "name", // Include only the "name" field from the User collection
        })
        .sort({ "lastMessage.createdAt": -1 }) // Sort by lastMessage.createdAt in descending order
        .lean()
        .exec();
      conversations.forEach((conversation) => {
        const lastMessage = conversation.lastMessage;
        if (lastMessage && lastMessage.deletedBy.includes(req.user.id)) {
          lastMessage.content = "You have deleted the message";
        }
      });
      conversations.sort((a, b) => {
        if (!a.lastMessage && b.lastMessage) return 1; // Conversation 'a' has no lastMessage but 'b' has one (move 'a' down)
        if (a.lastMessage && !b.lastMessage) return -1; // Conversation 'a' has a lastMessage but 'b' has none (move 'a' up)

        // Both conversations have lastMessage, compare their createdAt
        return b.lastMessage.createdAt - a.lastMessage.createdAt;
      });
      // console.log(conversations);
      res.json(conversations);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  });

  // Get messages of any person by reciever id
  router.get("/:receiverId", authenticator, async (req, res) => {
    try {
      const { receiverId } = req.params;
      const senderId = req.user.id;

      if (receiverId === req.user.id) {
        return res.json([]);
      }
      // If reciever blocked the account
      const receiverProfile = await Profile.findOne({ user: receiverId });
      const exist = receiverProfile.blockedUsers.includes(req.user.id); // Use includes() to check if user is blocked
      if (exist) {
        return res.json([]);
      }
      const conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] },
        deletedBy: { $ne: req.user.id },
      })
        .populate("messages")
        .exec();

      if (conversation) {
        const messages = conversation.messages.filter(
          (message) => !message.deletedBy.includes(req.user.id)
        );

        // console.log(messages);
        return res.json(messages);
      } else {
        return res.json([]);
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  });

  // Getting a particular message
  router.get("/message/:messageId", authenticator, async (req, res) => {
    try {
      const message = await Message.findById(req.params.messageId);

      if (!message) {
        return res.status(404).json({ msg: "Message not found" });
      }
      if (
        message.sender.toString() === req.user.id.toString() ||
        message.receiver.toString() === req.user.id.toString()
      ) {
        const userdeletedmessage = message.deletedBy.some(
          (user) => user === req.user.id
        );
        if (userdeletedmessage) {
          res.json("Message has been deleted ");
        } else {
          res.json(message.content);
        }
      } else {
        res.json("You are unauthorized to access this resource");
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  });

  // Add a new conversation by reciever id
  router.post("/new", authenticator, async (req, res) => {
    try {
      const { receiver_id, content } = req.body;

      if (!mongoose.Types.ObjectId.isValid(receiver_id)) {
        return res.status(400).json({ error: "Invalid receiver_id format" });
      }
      const receiver = await Profile.findOne({ user: receiver_id });
      if (!receiver) {
        return res.status(404).json({ error: "Receiver not found" });
      }
      const sender = await Profile.findOne({ user: req.user.id });

      if (receiver.blockedUsers.includes(req.user.id)) {
        res.status(404).json("Sorry you have been blocked");
        return;
      }
      if (sender.blockedUsers.includes(receiver_id)) {
        res.status(404).json("Firstly unblock user");
        return;
      }

      const existingConversation = await Conversation.findOne({
        participants: { $all: [req.user.id, receiver_id] },
      });

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const queryParams = new URLSearchParams(content).toString();
      let modifiedMessage = queryParams.slice(0, -1);
      try {
        var spam = await axios.get(
          `${process.env.REACT_APP_PREDICTION}/spam?message=${modifiedMessage}`,
          config
        );
      } catch (error) {
        console.log(error);
      }

      var savedMessage;

      // If existing conversation exists already
      if (existingConversation) {
        if (existingConversation.deletedBy.length !== 0) {
          existingConversation.deletedBy = [];
        }
        const newMessage = new Message({
          conversation: existingConversation._id,
          sender: req.user.id,
          receiver: receiver_id,
          content: content,
          spam: spam,
          deletedBy: [],
        });
        savedMessage = await newMessage.save();
        existingConversation.lastMessage = savedMessage._id;
        existingConversation.messages.push(savedMessage._id);
        const conversation = await existingConversation.save();
        const conversations = await Conversation.findById(conversation._id)
          .populate({
            path: "lastMessage",
            select: "con0tent deletedBy createdAt", // Include only the "name" field from the User collection
          })
          .populate({
            path: "participants",
            select: "name", // Include only the "name" field from the User collection
          })
          .lean()
          .exec();

        res.json({ savedMessage, conversations });
      } else {
        const newConversation = new Conversation({
          participants: [req.user.id, receiver_id],
          messages: [],
          deletedBy: [],
          lastMessage: null,
        });

        const savedConversation = await newConversation.save();

        const newMessage = new Message({
          conversation: savedConversation._id,
          sender: req.user.id,
          receiver: receiver_id,
          content: content,
          spam: spam,
          deletedBy: [],
        });
        savedMessage = await newMessage.save();
        savedConversation.lastMessage = savedMessage._id;
        savedConversation.messages.push(savedMessage._id);
        let finalConversation = await savedConversation.save();
        const conversations = await Conversation.findById(finalConversation._id)
          .populate({
            path: "lastMessage",
            select: "content deletedBy createdAt", // Include only the "name" field from the User collection
          })
          .populate({
            path: "participants",
            select: "name", // Include only the "name" field from the User collection
          })
          .lean()
          .exec();
        res.json({ savedMessage, conversations });
      }

      // Prediction of Emotion function
      async function Prediction() {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        const queryParams = new URLSearchParams(content).toString();
        let modifiedMessage = queryParams.slice(0, -1);

        console.log(queryParams);
        try {
          var emotion = await axios.get(
            `${process.env.REACT_APP_PREDICTION}/predictEmotion?request=${modifiedMessage}`,
            config
          );
        } catch (error) {
          console.log(error);
        }
        return emotion.data;
      }

      // After sending response to user Prediction Part
      process.nextTick(async () => {
        try {
          const emotion = await Prediction();

          const messageAnalysis = new Analysis({
            sender_id: req.user.id,
            receiver_id: receiver_id,
            message: savedMessage._id,
            moodPrediction: emotion,
          });
          await messageAnalysis.save();

          // Checking for message emotion analysis
          if (emotion === "fear") {
            // getting old messages for summary
            const messages = await Analysis.find({
              $or: [
                { sender_id: req.user.id, receiver_id: receiver_id },
                { sender_id: receiver_id, receiver_id: req.user.id },
              ],
            })
              .sort({ date: 1 })
              .limit(30)
              .populate({
                path: "message",
                select: " content ",
              })
              .populate({
                path: "sender_id",
                select: " name ",
              })
              .select(" message sender_id");

            // Merging messages
            const mergedMessages = messages
              .map((item) => {
                if (item.sender_id?._id.toString() === req.user.id.toString()) {
                  return `${sender.name} says ${item.message.content}.`;
                } else {
                  return `${receiver.name} says ${item.message.content}.`;
                }
              })
              .join(" ");

            // Header setup
            const config = {
              headers: {
                "Content-Type": "application/json",
              },
            };
            // making sendable passage on url
            const queryParams = new URLSearchParams(mergedMessages).toString();
            let modifiedPassage = queryParams.slice(0, -1);
            try {
              // Calling summary api
              var summary = await axios.get(
                `${process.env.REACT_APP_PREDICTION}/summarize?passage=${modifiedPassage}`,
                config
              );
            } catch (error) {}
            const predictionMessageId = messages.map((pred) => {
              return pred._id;
            });

            // Merging message comming from api
            const mergedPassage = summary?.data
              .map((item) => {
                return item;
              })
              .join(" ");
            const newSummary = new Summary({
              summary: mergedPassage,
              participants: [req.user.id, receiver_id],
              messages: predictionMessageId,
            });
            await newSummary.save();
          }
        } catch (error) {
          console.log(error);
        }
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  });

  // Delete a particular conversation and its associated messages by reciever id
  router.delete("/:recieverId", authenticator, async (req, res) => {
    try {
      const conversation = await Conversation.findOne({
        participants: { $all: [req.user.id, req.params.recieverId] },
        deletedBy: { $ne: req.user.id },
      });

      if (!conversation) {
        return res.status(404).json({ msg: "Conversation not found" });
      }

      conversation.deletedBy.push(req.user.id);
      await conversation.save();
      await Message.updateMany(
        { conversation: conversation._id },
        { $addToSet: { deletedBy: req.user.id } }
      );
      res.json(conversation._id);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  });

  // Delete a particular message with reciever id
  router.delete(
    "/:receiverid/message/:messageId",
    authenticator,
    async (req, res) => {
      try {
        const conversation = await Conversation.findOne({
          participants: { $all: [req.user.id, req.params.receiverid] },
          deletedBy: { $ne: req.user.id },
        });

        if (!conversation) {
          return res.status(404).json({ msg: "Conversation not found" });
        }

        const message = await Message.findOne({
          _id: req.params.messageId,
          conversation: conversation._id,
          deletedBy: { $ne: req.user.id },
        });

        if (!message) {
          return res.status(404).json({ msg: "Message not found" });
        }

        message.deletedBy.push(req.user.id);
        await message.save();

        res.json({ msg: "Message deleted successfully" });
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
      }
    }
  );

  return router;
};
