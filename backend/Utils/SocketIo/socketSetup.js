function socketSetup(socket) {
  // For socket setup
  socket.on("setup", (userId) => {
    socket.join(userId);
    socket.emit("Connected");
  });

  // Turning off setup for saving bandwidth
  socket.off("setup", () => {
    console.log("User Disconnected");
    socket.leave(socket.userId);
  });
}

module.exports = socketSetup;
