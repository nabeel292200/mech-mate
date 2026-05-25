import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000", {
      autoConnect: true,
      transports: ["websocket"]
    });
    
    socket.on("connect", () => {
      console.log("Connected to WebSocket Server:", socket?.id);
    });
    
    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket Server");
    });
  }
  return socket;
};
