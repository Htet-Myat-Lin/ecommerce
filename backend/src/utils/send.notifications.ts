import { NotificationService } from "../services/notification.service.js"

export const sendNofiToUser = async (userId: string, type: "MESSAGE" | "ORDER" | "SYSTEM", content: string) => {
    await NotificationService.createAndSendNotification(userId, type, content)
}

export const sendNotiToAdmin = async (type: "MESSAGE" | "ORDER" | "SYSTEM", content: string) => {
    const adminId = process.env.ADMIN_USER_ID as string
    await NotificationService.createAndSendNotification(adminId, type, content)
}