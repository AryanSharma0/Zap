const Conversation = require("../../models/Conversation");

async function newMessages(socket) {
  // For sending  and receiving new message
  // For sending  and receiving new message
  socket.on("new Messages", async (newMessage) => {
    var conversation = await Conversation.findById(newMessage.conversation);
    if (!conversation?.participants) {
      return console.log("chat.user not defined");
    }
    conversation.participants.forEach((user) => {
      if (user.toString() === newMessage.sender) return;
      socket
        .in(user.toString())
        .emit("messageReceived", { newMessage, conversation });
      console.log(user);
    });
  });
}

module.exports = newMessages;
