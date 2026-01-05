import { OrderModel } from "../models/order.model.js";
import { ProductModel } from "../models/product.model.js";
import { UserModel } from "../models/user.model.js";
import { CategoryModel } from "../models/category.model.js";

export class DashboardService {

  static async getDashboardStats() {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      paidOrders,
      pendingOrders,
      totalCategories,
    ] = await Promise.all([
      UserModel.countDocuments({ role: "user" }),
      ProductModel.countDocuments(),
      OrderModel.countDocuments(),
      OrderModel.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]),
      OrderModel.countDocuments({ paymentStatus: "paid" }),
      OrderModel.countDocuments({ paymentStatus: "pending" }),
      CategoryModel.countDocuments(),
    ]);

    const revenue = totalRevenue[0]?.total || 0;

    return {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: revenue,
      paidOrders,
      pendingOrders,
      totalCategories,
    };
  }


  static async getRevenueStats(period: "day" | "week" | "month" | "year" = "month") {
    const now = new Date();
    let startDate: Date;
    let groupFormat: string;

    switch (period) {
      case "day": {
        // Today, grouped by hour
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        groupFormat = "%Y-%m-%dT%H:00:00Z";
        break;
      }
      case "week": {
        // Last 7 days, grouped by day
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 6);
        startDate.setHours(0, 0, 0, 0);
        groupFormat = "%Y-%m-%d";
        break;
      }
      case "month": {
        // This month, grouped by day
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        groupFormat = "%Y-%m-%d";
        break;
      }
      case "year":
      default: {
        // This year, grouped by month
        startDate = new Date(now.getFullYear(), 0, 1);
        groupFormat = "%Y-%m";
        break;
      }
    }

    const revenueData = await OrderModel.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: groupFormat,
              date: "$createdAt",
            },
          },
          revenue: { $sum: "$totalPrice" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return revenueData;
  }

 
  static async getRecentOrders(limit: number = 10) {
    const orders = await OrderModel.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("user", "username email")
      .populate("items.product", "title images")
      .lean();

    return orders;
  }


  static async getTopProducts(limit: number = 10) {
    const topProducts = await OrderModel.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalSold: { $sum: "$items.quantity" },
          totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          _id: "$product._id",
          title: "$product.title",
          images: "$product.images",
          totalSold: 1,
          totalRevenue: 1,
        },
      },
    ]);

    return topProducts;
  }

  
  static async getOrderStatusStats() {
    const statusStats = await OrderModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const paymentStatusStats = await OrderModel.aggregate([
      {
        $group: {
          _id: "$paymentStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    return {
      orderStatus: statusStats,
      paymentStatus: paymentStatusStats,
    };
  }


  static async getUserGrowthStats(period: "week" | "month" | "year" = "month") {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case "week":
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case "month":
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case "year":
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
    }

    const userGrowth = await UserModel.aggregate([
      {
        $match: {
          role: "user",
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: period === "week" ? "%Y-%U" : period === "month" ? "%Y-%m" : "%Y",
              date: "$createdAt",
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return userGrowth;
  }


  static async getTodaySales() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayStats = await OrderModel.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          createdAt: { $gte: today, $lt: tomorrow },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    return todayStats[0] || { totalRevenue: 0, totalOrders: 0 };
  }
}

