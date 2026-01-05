import { useEffect } from "react";
import { useNotificationStore } from "../store/notificationStore";
import { useSocket } from "../context/socket.provider";

export const useNotificationSocket = () => {
  const socket = useSocket();
  const addNotification = useNotificationStore((s) => s.addNotification);

  useEffect(() => {
    if (!socket) return;

    socket.on("notification:new", (notification) => {
      addNotification(notification);
    });

    // Cleanup on unmount
    return () => {
      socket.off("notification:new");
    };
  }, [socket, addNotification]);
};
