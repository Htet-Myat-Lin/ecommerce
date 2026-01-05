import { create } from "zustand";

export type NotificationType = "MESSAGE" | "ORDER" | "SYSTEM";

export interface INotification {
  _id: string;
  user: string;
  type: NotificationType;
  content: string;
  isRead: boolean;
  createdAt: string;
}
interface NotificationState {
  notifications: INotification[];
  unreadCount: number;

  // for initial fetch
  setNotifications: (list: INotification[], unreadCount: number) => void;

  // realtime (socket)
  addNotification: (n: INotification) => void;

  // optimistic updates
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,

  setNotifications: (list, unreadCount) =>
    set({
      notifications: list,
      unreadCount,
    }),

  addNotification: (noti) =>
    set((state) => ({
      notifications: [...state.notifications, noti],
      unreadCount: state.unreadCount + (noti.isRead ? 0 : 1),
    })),

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n._id === id ? { ...n, isRead: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({
        ...n,
        isRead: true,
      })),
      unreadCount: 0,
    })),
}));
