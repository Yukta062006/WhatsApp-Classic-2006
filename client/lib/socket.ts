import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function connectSocket(token: string) {
  if (socket?.connected) return socket;
  socket = io(process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000", {
    auth: { token },
  });
  return socket;
}

export function getSocket() { return socket; }
export function disconnectSocket() { socket?.disconnect(); socket = null; }
