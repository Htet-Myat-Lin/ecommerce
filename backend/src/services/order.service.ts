import { OrderModel } from "../models/order.model.js";
import { ProductModel } from "../models/product.model.js";
import { AppError } from "../utils/app.error.js";
import { NotificationService } from "./notification.service.js";
import mongoose from "mongoose";

export class OrderService {
  
  static async createOrder(orderData: any) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { items, user, totalPrice } = orderData;
      // Check stock for each item
      for (const item of items) {
        const product = await ProductModel.findOne(
          {
            _id: item.product,
            "variants.sku": item.variantSku,
          },
          {
            "variants.$": 1,
          }
        ).session(session);
        if (!product) {
          throw new AppError("Product or variant not found", 404);
        }

        const variant = product.variants[0];
        if (variant && (variant.stock < item.quantity)) {
          throw new AppError(`Not enough stock for ${product.title} - ${variant.sku}`, 400);
        }
      }

      // order creating (stock will be decreased after successful payment)
      const [order] = await OrderModel.create([{ user, items, totalPrice }], { session });

      await session.commitTransaction();
      session.endSession();
      return order
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  }
 
  static async decreaseStockAfterPayment(orderId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const order = await OrderModel.findById(orderId).session(session);
      
      if (!order) {
        throw new AppError("Order not found", 404);
      }

      if (order.paymentStatus === "paid") {
        throw new AppError("Order already paid", 400);
      }

      // Decrease stock for each item
      for (const item of order.items) {

        if(!item.variantSku) throw new AppError("Variant Sku is required", 400)
          
        const product = await ProductModel.findOne(
          {
            _id: item.product,
            "variants.sku": item.variantSku,
          },
          {
            "variants.$": 1,
          }
        ).session(session);

        if (!product) {
          throw new AppError("Product or variant not found", 404);
        }

        const variant = product.variants[0];
        if (variant && (variant.stock < item.quantity)) {
          throw new AppError("Not enough stock!", 400);
        }

        await ProductModel.updateOne(
          {
            _id: item.product,
            "variants.sku": item.variantSku,
          },
          {
            $inc: {
              "variants.$.stock": -item.quantity,
            },
          },
          { session }
        );
      }

      // Update order payment status
      order.paymentStatus = "paid";
      await order.save({ session });

      // Send notification for successful payment
      await NotificationService.createAndSendNotification(
        order.user.toString(),
        "ORDER",
        `Payment successful! Your order #${order._id.toString().slice(-6)} has been confirmed.`
      );

      await session.commitTransaction();
      session.endSession();
      return order;
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  }

  static async getOrderById(orderId: string, userId: string) {
    const order = await OrderModel.findOne({
      _id: orderId,
      user: userId,
    }).populate("items.product", "title images slug brand").populate("user", "username email");
    if (!order) {
      throw new AppError("Order not found", 404);
    }
    return order;
  }

  static async updateOrderStatus(orderId: string, status: "pending" | "shipped" | "delivered" | "cancelled") {
    const order = await OrderModel.findById(orderId);
    if (!order) {
      throw new AppError("Order not found", 404);
    }
    order.status = status;
    await order.save();
    // Send notification for status update
    let message = "";
    switch (status) {
      case "shipped":
        message = `Your order #${order._id.toString().slice(-6)} has been shipped!`;
        break;
      case "delivered":
        message = `Your order #${order._id.toString().slice(-6)} has been delivered!`;
        break;
      case "cancelled":
        message = `Your order #${order._id.toString().slice(-6)} has been cancelled.`;
        break;
      default:
        message = `Your order #${order._id.toString().slice(-6)} status has been updated to ${status}.`;
    }

    await NotificationService.createAndSendNotification(
      order.user.toString(),
      "ORDER",
      message
    );

    return order;
  }
}
