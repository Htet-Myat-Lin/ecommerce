import { OrderService } from "../services/order.service.js";
import { AppError } from "../utils/app.error.js";
import { asyncHandler } from "../utils/async.handler.js";
import { sendNofiToUser, sendNotiToAdmin } from "../utils/send.notifications.js";

export const createOrder = asyncHandler(async(req, res, next) => {
    const userId = req.user?._id
    if(!userId) throw new AppError("User not authenticated", 401)
    const newOrder = await OrderService.createOrder({...req.body, user: userId})
    await sendNofiToUser(userId as unknown as string, "ORDER", `Your order has been created.`)
    await sendNotiToAdmin("ORDER", `A new order has been placed by user ${userId}.`)
    res.status(201).json({ success: true, message: "Order created", order: newOrder })
})

export const updateOrderStatus = asyncHandler(async(req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;
    if(!id) throw new AppError("Order ID is required", 400)
    const updatedOrder = await OrderService.updateOrderStatus(id, status);
    res.status(200).json({ success: true, message: "Order status updated", order: updatedOrder });
})

