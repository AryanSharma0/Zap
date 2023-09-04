function typing(socket) {
  // For typing functionality
  socket.on("typing", (room) => {
    socket.in(room).emit("typing", room);
  });

  socket.on("stoptyping", (room) => {
    socket.in(room).emit("stoptyping", room);
  });
}

module.exports = typing;
   