import { io } from "socket.io-client";

const socket = io("https://snapwave-bha7.onrender.com", {
  autoConnect: false,
  transports: ["websocket"],
});

export default socket;