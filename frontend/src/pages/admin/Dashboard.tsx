/* eslint-disable react-hooks/static-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Spinner } from "flowbite-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  useDashboardStats,
  useRevenueStats,
  useRecentOrders,
  useTopProducts,
  useOrderStatusStats,
  useTodaySales,
} from "../../hooks/queries";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const IMAGE_BASE = "http://localhost:3000/uploads/product-images/";

export function Dashboard() {
  const [revenuePeriod, setRevenuePeriod] = useState<"day" | "week" | "month" | "year">("month");

  const { data: statsData, isPending: statsLoading } = useDashboardStats();
  const { data: revenueData, isPending: revenueLoading } = useRevenueStats(revenuePeriod);
  const { data: recentOrdersData, isPending: ordersLoading } = useRecentOrders(5);
  const { data: topProductsData, isPending: productsLoading } = useTopProducts(5);
  const { data: statusStatsData } = useOrderStatusStats();
  const { data: todaySalesData } = useTodaySales();

  const stats = statsData?.data || {};
  const recentOrders = recentOrdersData?.data || [];
  const topProducts = topProductsData?.data || [];
  const revenueStats = revenueData?.data || [];
  // const orderStatus = statusStatsData?.data?.orderStatus || [];
  const paymentStatus = statusStatsData?.data?.paymentStatus || [];
  const todaySales = todaySalesData?.data || { totalRevenue: 0, totalOrders: 0 };

  // Calculate percentage changes (mock for now, can be enhanced with previous period data)
  const revenueChange = 12.5;
  const ordersChange = 8.3;
  const usersChange = 15.2;

  const StatCard = ({
    title,
    value,
    icon: Icon,
    change,
    changeType,
    loading,
  }: {
    title: string;
    value: string | number;
    icon: any;
    change?: number;
    changeType?: "increase" | "decrease";
    loading: boolean;
  }) => {
    if (loading) {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <Spinner size="sm" />
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <Icon className="text-blue-600" size={24} />
          </div>
          {change !== undefined && (
            <div
              className={`flex items-center gap-1 text-sm font-medium ${
                changeType === "increase" ? "text-green-600" : "text-red-600"
              }`}
            >
              {changeType === "increase" ? (
                <ArrowUpRight size={16} />
              ) : (
                <ArrowDownRight size={16} />
              )}
              {Math.abs(change)}%
            </div>
          )}
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-1">{value}</h3>
        <p className="text-sm text-slate-500">{title}</p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue?.toLocaleString() || 0}`}
          icon={DollarSign}
          change={revenueChange}
          changeType="increase"
          loading={statsLoading}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders || 0}
          icon={ShoppingCart}
          change={ordersChange}
          changeType="increase"
          loading={statsLoading}
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers || 0}
          icon={Users}
          change={usersChange}
          changeType="increase"
          loading={statsLoading}
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts || 0}
          icon={Package}
          loading={statsLoading}
        />
      </div>

      {/* Today's Sales & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">Today's Sales</h2>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-500 mb-1">Revenue</p>
              <p className="text-2xl font-black text-slate-900">
                ${todaySales.totalRevenue?.toLocaleString() || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Orders</p>
              <p className="text-2xl font-black text-slate-900">{todaySales.totalOrders || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Order Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-green-500" size={18} />
                <span className="text-sm text-slate-600">Paid</span>
              </div>
              <span className="font-bold text-slate-900">
                {paymentStatus.find((s: any) => s._id === "paid")?.count || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="text-yellow-500" size={18} />
                <span className="text-sm text-slate-600">Pending</span>
              </div>
              <span className="font-bold text-slate-900">
                {paymentStatus.find((s: any) => s._id === "pending")?.count || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="text-red-500" size={18} />
                <span className="text-sm text-slate-600">Failed</span>
              </div>
              <span className="font-bold text-slate-900">
                {paymentStatus.find((s: any) => s._id === "failed")?.count || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">Revenue Trend</h2>
            <select
              value={revenuePeriod}
              onChange={(e) =>
                setRevenuePeriod(e.target.value as "day" | "week" | "month" | "year")
              }
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
          {revenueLoading ? (
            <div className="flex items-center justify-center h-64">
              <Spinner size="xl" />
            </div>
          ) : revenueStats.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-slate-500">
              No revenue data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={revenueStats.map((item: any) => ({
                  date: revenuePeriod === "day"
                    ? new Date(item._id).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric" })
                    : revenuePeriod === "week"
                    ? new Date(item._id).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                    : revenuePeriod === "month"
                    ? new Date(item._id).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                    : new Date(item._id + "-01").toLocaleDateString("en-US", { month: "short" }),
                  revenue: item.revenue,
                  orders: item.orders,
                }))}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                  formatter={(value: any) => [`$${value.toLocaleString()}`, "Revenue"]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Top Selling Products</h2>
          {productsLoading ? (
            <div className="flex items-center justify-center h-64">
              <Spinner size="xl" />
            </div>
          ) : topProducts.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-slate-500">
              No products data available
            </div>
          ) : (
            <div className="space-y-4">
              {topProducts.map((product: any, index: number) => (
                <div key={product._id} className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                    {product.images?.[0] && (
                      <img
                        src={`${IMAGE_BASE}${product.images[0]}`}
                        alt={product.title}
                        className="w-full h-full object-contain p-1"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 text-sm truncate">{product.title}</p>
                    <p className="text-xs text-slate-500">
                      {product.totalSold} sold • ${product.totalRevenue?.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-lg font-black text-blue-600">#{index + 1}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Orders</h2>
        {ordersLoading ? (
          <div className="flex items-center justify-center h-64">
            <Spinner size="xl" />
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-slate-500">
            No orders yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-bold text-slate-700">Order ID</th>
                  <th className="text-left py-3 px-4 text-sm font-bold text-slate-700">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-bold text-slate-700">Items</th>
                  <th className="text-left py-3 px-4 text-sm font-bold text-slate-700">Total</th>
                  <th className="text-left py-3 px-4 text-sm font-bold text-slate-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-bold text-slate-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order: any) => {
                  const user = typeof order.user === "object" ? order.user : null;
                  return (
                    <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-mono text-slate-600">
                        {order._id.slice(-8)}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-700">
                        {user?.username || "Unknown"}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">{order.items.length}</td>
                      <td className="py-3 px-4 text-sm font-bold text-slate-900">
                        ${order.totalPrice?.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            order.paymentStatus === "paid"
                              ? "bg-green-100 text-green-700"
                              : order.paymentStatus === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
