import { axiosInstance } from "./axios.instance";

export const getDashboardStatsApi = async () => {
  const response = await axiosInstance.get("/admin/dashboard/stats");
  return response.data;
};

export const getRevenueStatsApi = async (period: "day" | "week" | "month" | "year" = "month") => {
  const response = await axiosInstance.get(`/admin/dashboard/revenue?period=${period}`);
  return response.data;
};

export const getRecentOrdersApi = async (limit: number = 10) => {
  const response = await axiosInstance.get(`/admin/dashboard/recent-orders?limit=${limit}`);
  return response.data;
};

export const getTopProductsApi = async (limit: number = 10) => {
  const response = await axiosInstance.get(`/admin/dashboard/top-products?limit=${limit}`);
  return response.data;
};

export const getOrderStatusStatsApi = async () => {
  const response = await axiosInstance.get("/admin/dashboard/order-status");
  return response.data;
};

export const getUserGrowthStatsApi = async (period: "week" | "month" | "year" = "month") => {
  const response = await axiosInstance.get(`/admin/dashboard/user-growth?period=${period}`);
  return response.data;
};

export const getTodaySalesApi = async () => {
  const response = await axiosInstance.get("/admin/dashboard/today-sales");
  return response.data;
};

