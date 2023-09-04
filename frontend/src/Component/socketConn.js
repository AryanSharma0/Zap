import { io } from "socket.io-client";

const socket = (authToken) =>
  new io("http://localhost:5000", {
    autoConnect: false,
    withCredentials: true,
    auth: {
      "auth-token": authToken,
    },
  });

export default socket;
