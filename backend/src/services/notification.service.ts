import { NotificationModel } from "../models/notification.model.js";
import { io } from "../server.js";

export class NotificationService {
  static async createAndSendNotification(
    userId: string,
    type: "MESSAGE" | "ORDER" | "SYSTEM",
    content: string
  ) {
    const notification = await NotificationModel.create({
      user: userId,
      type,
      content,
    });
    io.to(`user_${userId}`).emit("notification:new", notification);

    return notification;
  }

  static async getUserNotifications(userId: string) {
    return NotificationModel.find({ user: userId }).sort({ createdAt: -1 })
  }

  static async markAsRead(notiId: string, userId: string) {

    const notification = await NotificationModel.findOneAndUpdate(
      { _id: notiId, user: userId },
      { isRead: true },
      { new: true }
    );
    return notification;
  }

  static async markAllAsRead(userId: string) {
    await NotificationModel.updateMany(
      { user: userId },
      { isRead: true }
    )
  }

  static async deleteNotification(notiId: string, userId: string) {
    await NotificationModel.findOneAndDelete({ _id: notiId, user: userId });
  }
}
