const connectToMongo = require("./db");
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const helmet = require("helmet");
const socketAuthenticator = require("./middleware/socketAuthenticator");
const joinChat = require("./Utils/SocketIo/joinChat");
const socketSetup = require("./Utils/SocketIo/socketSetup");
const newMessage = require("./Utils/SocketIo/newMessage");
const typing = require("./Utils/SocketIo/typing");
const rateLimit = require("express-rate-limit");
var cors = require("cors");
connectToMongo();

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
// app.set("trust proxy", process.env.REACT_APP_FRONTEND);
const server = http.createServer(app);
const io = socketIO(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.REACT_APP_FRONTEND,
    credentials: true,
  },
});
const port = 5000;

//  Rate limiter
app.use(
  rateLimit({
    windowMs: 1000,
    max: 2000,
    message: "You exceeded 100 requests in 12 hour limit!",
    headers: true,
  })
);

// Import and use the API routes
const authRoutes = require("./routes/auth");
const conversationRoutes = require("./routes/conversation");
const profileRoutes = require("./routes/profile");
const searchRoutes = require("./routes/search");

// Available Routes
app.use("/api/auth", authRoutes());
app.use("/api/conversation", conversationRoutes());
app.use("/api/profile", profileRoutes);
app.use("/api/search", searchRoutes);

io.use(socketAuthenticator);
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);

  io.on("connection", (socket) => {
    console.log("socketIo connected");
    joinChat(socket);
    socketSetup(socket);
    newMessage(socket);
    typing(socket);
  });
});
