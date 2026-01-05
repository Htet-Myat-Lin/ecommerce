import { Router } from "express";
import { protect, requireEmailVerified, restrictTo } from "../middleware/auth.js";
import { processPayment, getOrderById } from "../controllers/payment.controller.js";

const router = Router();

// Process payment for an order
router.post("/process", protect, requireEmailVerified, restrictTo("user", "admin"), processPayment);

// Get order by ID (for payment page)
router.get("/order/:orderId", protect, requireEmailVerified, restrictTo("user", "admin"), getOrderById);

export default router;

