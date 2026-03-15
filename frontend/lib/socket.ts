import { io } from "socket.io-client";
const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

console.log("Connecting to Socket.IO server at:", SOCKET_URL);

export const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  withCredentials: true,
});
