import { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";

export type NotificationItem = {
  type: string;
  message: string;
  taskId?: string;
  createdAt?: string;
};

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const socket = getSocket();

    const handler = (data: NotificationItem) => {
      setNotifications((prev) => [
        { ...data, createdAt: new Date().toISOString() },
        ...prev,
      ]);
    };

    socket.on("notification:new", handler);

    return () => {
      socket.off("notification:new", handler);
    };
  }, []);

  function clearNotifications() {
    setNotifications([]);
  }

  return { notifications, clearNotifications };
}
