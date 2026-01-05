import { Router } from "express";
import { protect, requireEmailVerified, restrictTo } from "../middleware/auth.js";
import { createOrder, updateOrderStatus } from "../controllers/order.controller.js";

const router = Router()

router.post("/", protect, requireEmailVerified, restrictTo("user", "admin"), createOrder)
router.patch("/:id/status", protect, restrictTo("admin"), updateOrderStatus)

export default router