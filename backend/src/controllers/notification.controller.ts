import type { Response } from "express";
import { asyncHandler } from "../utils/async.handler.js";
import { NotificationService } from "../services/notification.service.js";
import { AppError } from "../utils/app.error.js";

export const getUserNotifications = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id
  const notifications = await NotificationService.getUserNotifications(userId as unknown as string)
  res.status(200).json({ success: true, notifications })
})

export const markAsRead = asyncHandler(async(req, res, next) => {
  const userId = req.user?._id
  const notiId = req.params.id

  if(!userId || !notiId) throw new AppError("Invalid request", 400)

  const notification = await NotificationService.markAsRead(notiId as unknown as string, userId as unknown as string)

  res.status(200).json({ success: true, notification, message: "Notification marked as read" })
})

export const markAllAsRead = asyncHandler(async(req, res, next) => {
  const userId = req.user?._id
  await NotificationService.markAllAsRead(userId as unknown as string)
  res.status(200).json({ success: true, message: "All notifications marked as read" })
})

export const deleteNotification = asyncHandler(async(req, res, next) => {
  const userId = req.user?._id
  const notiId = req.params.id
  await NotificationService.deleteNotification(notiId as unknown as string, userId as unknown as string)
  res.status(200).json({ success: true, message: "Notification deleted" })
})