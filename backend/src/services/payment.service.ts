import { PaymentModel } from "../models/payment.model.js";
import { OrderService } from "./order.service.js";
import { AppError } from "../utils/app.error.js";
import { OrderModel } from "../models/order.model.js";
import { v4 } from "uuid"

export class PaymentService {

  private static async mockStripePayment(paymentData: any): Promise<{success: boolean; transactionId: string; error?: string}> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Generate mock transaction ID
    const transactionId = v4();

    if (!paymentData.cardNumber || paymentData.cardNumber.replace(/\s/g, "").length < 13) {
      return {
        success: false,
        transactionId,
        error: "Invalid card number",
      };
    }
    if (!paymentData.expiryDate || !/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) {
      return {
        success: false,
        transactionId,
        error: "Invalid expiry date"
      };
    }
    if (!paymentData.cvc || paymentData.cvc.length < 3) {
      return {
        success: false,
        transactionId,
        error: "Invalid CVC",
      };
    }

    // Mock 95% success rate
    if (Math.random() > 0.95) {
      return {
        success: false,
        transactionId,
        error: "Payment declined by bank",
      };
    }

    return {
      success: true,
      transactionId,
    };
  }

  static async processPayment(orderId: string, paymentMethod: string, paymentData: any) {

    const mockPaymentResult = await this.mockStripePayment(paymentData);

    if (!mockPaymentResult.success) {
      // Create failed payment record
      await PaymentModel.create({
        order: orderId,
        method: paymentMethod,
        transactionId: mockPaymentResult.transactionId,
        status: "failed",
      });

      // Update order payment status to failed
      await OrderModel.findByIdAndUpdate(orderId, {
        paymentStatus: "failed",
      });

      throw new AppError("Payment failed: " + mockPaymentResult.error, 400);
    }

    // Payment successful - decrease stock and update order
    const order = await OrderService.decreaseStockAfterPayment(orderId);

    // Create successful payment record
    const payment = await PaymentModel.create({
      order: orderId,
      method: paymentMethod,
      transactionId: mockPaymentResult.transactionId,
      status: "succeeded",
    });

    return {
      payment,
      order,
      transactionId: mockPaymentResult.transactionId,
    };
  }
}

