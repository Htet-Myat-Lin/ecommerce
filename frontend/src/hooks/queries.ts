import { useQuery } from "@tanstack/react-query";
import { getProductApi, getProductsApi } from "../api/product.api";
import { getCategoriesApi } from "../api/category.api";
import { getOrderByIdApi } from "../api/order.api";
import {
  getDashboardStatsApi,
  getRevenueStatsApi,
  getRecentOrdersApi,
  getTopProductsApi,
  getOrderStatusStatsApi,
  getUserGrowthStatsApi,
  getTodaySalesApi,
} from "../api/dashboard.api";
import { useEffect } from "react";
import { useNotificationStore, type INotification } from "../store/notificationStore";
import { useAuthStore } from "../store/authStore";
import { getUserNotificationsApi } from "../api/notification.api";
import { getWishlistApi } from "../api/wishlist.api";
import { checkExistingReviewApi, getProductReviewsApi, getUserReviewsApi } from "../api/review.api";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useProducts = (filters?: any) => {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => getProductsApi(filters),
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => getProductApi(id),
  });
};

// ------------------------------------------------------------------------

// Cateogry
export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesApi,
  });
};

// ------------------------------------------------------------------------

// Order
export const useOrder = (orderId: string | null) => {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderByIdApi(orderId!),
    enabled: !!orderId,
  });
};

// ------------------------------------------------------------------------

// Dashboard queries
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: getDashboardStatsApi,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useRevenueStats = (
  period: "day" | "week" | "month" | "year" = "month"
) => {
  return useQuery({
    queryKey: ["dashboard", "revenue", period],
    queryFn: () => getRevenueStatsApi(period),
  });
};

export const useRecentOrders = (limit: number = 10) => {
  return useQuery({
    queryKey: ["dashboard", "recent-orders", limit],
    queryFn: () => getRecentOrdersApi(limit),
  });
};

export const useTopProducts = (limit: number = 10) => {
  return useQuery({
    queryKey: ["dashboard", "top-products", limit],
    queryFn: () => getTopProductsApi(limit),
  });
};

export const useOrderStatusStats = () => {
  return useQuery({
    queryKey: ["dashboard", "order-status"],
    queryFn: getOrderStatusStatsApi,
  });
};

export const useUserGrowthStats = (
  period: "week" | "month" | "year" = "month"
) => {
  return useQuery({
    queryKey: ["dashboard", "user-growth", period],
    queryFn: () => getUserGrowthStatsApi(period),
  });
};

export const useTodaySales = () => {
  return useQuery({
    queryKey: ["dashboard", "today-sales"],
    queryFn: getTodaySalesApi,
    refetchInterval: 60000, // Refetch every minute
  });
};

// ------------------------------------------------------------------------

// Notification
export const useNotificationsQuery = () => {
  const setNotifications = useNotificationStore(
    (s) => s.setNotifications
  );
  const user = useAuthStore((s) => s.user);

  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: getUserNotificationsApi,
    enabled: !!user,
    staleTime: Infinity
  });

  useEffect(() => {
    if (!query.data) return;

    setNotifications(
      query.data.notifications,
      query.data.notifications.filter((n: INotification) => !n.isRead).length
    );
  }, [query.data, setNotifications]);

  return query;
};

// ------------------------------------------------------------------------

// Wishlist
export const useWishlistQuery = () => {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlistApi
  })
}

// ------------------------------------------------------------------------

// Review
export const useGetProductReviewsQuery = (productId: string) => {
  return useQuery({
    queryKey: ["product-reviews", productId],
    queryFn: () => getProductReviewsApi(productId)
  })
}

export const useGetUserReviwesQuery = () => {
  return useQuery({
    queryKey: ["user-reviews"],
    queryFn: getUserReviewsApi
  })
}

export const useCheckExistingReview = (productId: string) => {
  return useQuery({
    queryKey: ['reviews', productId, 'mine'], 
    queryFn: () => checkExistingReviewApi(productId)
  })
}