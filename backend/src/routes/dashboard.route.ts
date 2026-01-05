import { Router } from "express";
import { protect, requireEmailVerified, restrictTo } from "../middleware/auth.js";
import {
  getDashboardStats,
  getRevenueStats,
  getRecentOrders,
  getTopProducts,
  getOrderStatusStats,
  getUserGrowthStats,
  getTodaySales,
} from "../controllers/dashboard.controller.js";

const router = Router();

router.use(protect, requireEmailVerified, restrictTo("admin"));

router.get("/stats", getDashboardStats);
router.get("/revenue", getRevenueStats);
router.get("/recent-orders", getRecentOrders);
router.get("/top-products", getTopProducts);
router.get("/order-status", getOrderStatusStats);
router.get("/user-growth", getUserGrowthStats);
router.get("/today-sales", getTodaySales);

export default router;

