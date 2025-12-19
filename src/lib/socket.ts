import { io, Socket } from "socket.io-client";

type ServerToClientEvents = {
  "task:created": (task: any) => void;
  "task:updated": (task: any) => void;
  "task:deleted": (payload: { id: string } | string) => void;
  "notification:new": (data: any) => void;
};

type ClientToServerEvents = {
  join: (userId: string) => void;
  "join:tasks": () => void;
};

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

export function getSocket() {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) throw new Error("NEXT_PUBLIC_API_URL is not set");

  if (!socket) {
    socket = io(url, {
      withCredentials: true,
      autoConnect: false, // ✅ we connect only when user known
      transports: ["websocket", "polling"],
    });
  }

  return socket;
}

/** Connect socket safely (idempotent) */
export function connectSocket() {
  const s = getSocket();
  if (!s.connected) s.connect();
  return s;
}

/** Disconnect + reset singleton */
export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
