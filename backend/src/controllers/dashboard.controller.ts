import { DashboardService } from "../services/dashboard.service.js";
import { asyncHandler } from "../utils/async.handler.js";

export const getDashboardStats = asyncHandler(async (req, res, next) => {
  const stats = await DashboardService.getDashboardStats();
  res.status(200).json({ success: true, data: stats });
});

export const getRevenueStats = asyncHandler(async (req, res, next) => {
  const { period } = req.query;
  const validPeriods = ["day", "week", "month", "year"];
  const selectedPeriod = validPeriods.includes(period as string) 
    ? (period as "day" | "week" | "month" | "year")
    : "week";
  const revenueStats = await DashboardService.getRevenueStats(selectedPeriod);
  res.status(200).json({ success: true, data: revenueStats });
});

export const getRecentOrders = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const orders = await DashboardService.getRecentOrders(limit);
  res.status(200).json({ success: true, data: orders });
});

export const getTopProducts = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const products = await DashboardService.getTopProducts(limit);
  res.status(200).json({ success: true, data: products });
});

export const getOrderStatusStats = asyncHandler(async (req, res, next) => {
  const stats = await DashboardService.getOrderStatusStats();
  res.status(200).json({ success: true, data: stats });
});

export const getUserGrowthStats = asyncHandler(async (req, res, next) => {
  const { period } = req.query;
  const validPeriods = ["week", "month", "year"];
  const selectedPeriod = validPeriods.includes(period as string)
    ? (period as "week" | "month" | "year")
    : "month";
  
  const userGrowth = await DashboardService.getUserGrowthStats(selectedPeriod);
  res.status(200).json({ success: true, data: userGrowth });
});

export const getTodaySales = asyncHandler(async (req, res, next) => {
  const todayStats = await DashboardService.getTodaySales();
  res.status(200).json({ success: true, data: todayStats });
});