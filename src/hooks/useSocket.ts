import { useEffect } from "react";
import { connectSocket, disconnectSocket, getSocket } from "@/lib/socket";

export function useSocket(userId?: string) {
  useEffect(() => {
    if (!userId) {
      // If user logs out, disconnect
      disconnectSocket();
      return;
    }

    const socket = connectSocket();

    // join personal + tasks rooms
    socket.emit("join", userId);
    socket.emit("join:tasks");

    // helpful logs while debugging
    const onConnect = () => console.log("✅ socket connected:", socket.id);
    const onDisconnect = () => console.log("🛑 socket disconnected");

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      // DO NOT disconnect here; global app might still need socket
      // disconnect is handled when userId becomes undefined (logout)
    };
  }, [userId]);
}
