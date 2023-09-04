const Conversation = require("../../models/Conversation");

function joinChat(socket) {
  // For joining a room
  socket.on("join chat", async (room) => {
    const userId = socket.userId.id;
    const conversation = await Conversation.findById(room)
      .select("participants")
      .exec();
    if (
      !conversation?.participants.some(
        (id) => id.toString() === userId?.toString()
      )
    ) {
      socket.emit("error", {
        message: "Not authorized to access this resource.",
      });
      socket.disconnect();
    } else {
    socket.join(room);
    console.log("User joined Room ", room);
    }
  });
}

module.exports = joinChat;
