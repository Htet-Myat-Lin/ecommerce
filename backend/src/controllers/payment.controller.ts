import { PaymentService } from "../services/payment.service.js";
import { OrderService } from "../services/order.service.js";
import { asyncHandler } from "../utils/async.handler.js";

export const processPayment = asyncHandler(async (req, res, next) => {
  const { orderId, paymentMethod, paymentData } = req.body;
  const userId = req.user?._id;

  if (!orderId || !paymentMethod || !paymentData || !userId) {
    return res.status(400).json({
      success: false,
      message: "Order ID, User ID, payment method, and payment data are required",
    });
  }

  // Verify order belongs to user
  const order = await OrderService.getOrderById(orderId, userId.toString());
  
  if (order.paymentStatus === "paid") {
    return res.status(400).json({
      success: false,
      message: "Order already paid",
    });
  }

  const result = await PaymentService.processPayment(orderId, paymentMethod, paymentData);

  res.status(200).json({
    success: true,
    message: "Payment processed successfully",
    payment: result.payment,
    order: result.order,
    transactionId: result.transactionId,
  });
});

export const getOrderById = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;
  const userId = req.user?._id;

  if (!orderId || !userId) {
    return res.status(400).json({
      success: false,
      message: "Order ID, and User ID are required",
    });
  }

  const order = await OrderService.getOrderById(orderId, userId.toString());

  res.status(200).json({
    success: true,
    order,
  });
});

