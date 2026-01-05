import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  forgotPasswordApi,
  loginApi,
  logoutApi,
  registerApi,
  resetPasswordApi,
  sendEmailVerifyOTPApi,
  sendResetOTPApi,
  verifyEmailApi,
} from "../api/auth.api";
import { useAuthStore } from "../store/authStore";
import { useModalStore } from "../store/modalStore";
import type { IUser } from "../utils/types";
import {
  createProductApi,
  deleteProductApi,
  updateProductApi,
} from "../api/product.api";
import {
  createCategoryApi,
  deleteCategoryApi,
  updateCategoryApi,
} from "../api/category.api";
import { createOrderApi } from "../api/order.api";
import { processPaymentApi } from "../api/payment.api";
import axios from "axios";
import {
  deleteNotificationApi,
  markAllAsReadApi,
  markAsReadApi,
} from "../api/notification.api";
import {
  addToWishlistApi,
  clearWishlistApi,
  removeFromWishlistApi,
} from "../api/wishlist.api";
import { createReviewApi, deleteReviewApi, updateReviewApi } from "../api/review.api";

const setUser = useAuthStore.getState().setUser;
const setAccessToken = useAuthStore.getState().setAccessToken;
const setRegisterModalOpen = useModalStore.getState().setOpenRegisterModal;
const setOpenLoginModal = useModalStore.getState().setOpenLoginModal;

// Auth
export const useRegisterMutation = (
  onSuccessCallback: (user: IUser) => void
) => {
  return useMutation({
    mutationFn: registerApi,
    onSuccess: (data) => {
      console.log("[useRegisterMutation] onSuccess data:", data);
      setUser(data.user);
      setAccessToken(data.accessToken);
      onSuccessCallback(data.user);
      setRegisterModalOpen(false);
    },
    onError: (err) => {
      console.error("[useRegisterMutation] onError:", err);
    },
  });
};

export const useLoginMutation = (onSuccessCallback: (user: IUser) => void) => {
  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      setUser(data.user);
      setAccessToken(data.accessToken);
      setOpenLoginModal(false);
      onSuccessCallback(data.user);
    },
  });
};

export const useLogoutMutation = (onSuccessCallback: () => void) => {
  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      setUser(null);
      onSuccessCallback();
      setOpenLoginModal(true);
    },
  });
};

export const useSendingEmailVerifyOTP = () => {
  return useMutation({
    mutationFn: sendEmailVerifyOTPApi,
  });
};

export const useEmailVerification = (onSuccessCallback: () => void) => {
  return useMutation({
    mutationFn: verifyEmailApi,
    onSuccess: () => {
      onSuccessCallback();
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPasswordApi,
  });
};

export const useSendingResetOTP = () => {
  return useMutation({
    mutationFn: sendResetOTPApi,
  });
};

export const useResetPassword = (onSuccessCallback: () => void) => {
  return useMutation({
    mutationFn: resetPasswordApi,
    onSuccess: () => {
      onSuccessCallback();
      setOpenLoginModal(true);
    },
  });
};

// ------------------------------------------------------------------------

// Category
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategoryApi,
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useEditCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCategoryApi,
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategoryApi,
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

// ------------------------------------------------------------------------

// Product
export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProductApi,
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProductApi,
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProductApi,
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

// ------------------------------------------------------------------------

// Order
export const useCreateOrderMutation = () => {
  return useMutation({
    mutationFn: createOrderApi,
    onError: (err) => {
      alert(
        axios.isAxiosError(err)
          ? err?.response?.data.message
          : "Error while ordering"
      );
    },
  });
};

// ------------------------------------------------------------------------

// Payment
export const useProcessPaymentMutation = () => {
  return useMutation({
    mutationFn: processPaymentApi,
    onError: (err) => {
      alert(
        axios.isAxiosError(err)
          ? err?.response?.data?.message || "Payment failed"
          : "Payment failed"
      );
    },
  });
};

// ------------------------------------------------------------------------

// Notification
export const useMarkNotificationAsReadMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAsReadApi,
    onError: (err) => {
      alert(
        axios.isAxiosError(err)
          ? err?.response?.data?.message ||
              "Failed to mark notification as read"
          : "Failed to mark notification as read"
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export const useMarkAllNotificationsAsReadMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllAsReadApi,
    onError: (err) => {
      alert(
        axios.isAxiosError(err)
          ? err?.response?.data?.message ||
              "Failed to mark all notifications as read"
          : "Failed to mark all notifications as read"
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export const useDeleteNotificationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteNotificationApi,
    onError: (err) => {
      alert(
        axios.isAxiosError(err)
          ? err?.response?.data?.message || "Failed to delete notification"
          : "Failed to delete notification"
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

// ------------------------------------------------------------------------

// Wishlist
export const useAddWishlistMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addToWishlistApi,
    onError: (err) => {
      alert(
        axios.isAxiosError(err)
          ? err?.response?.data?.message || "Failed to add to wishlist"
          : "Failed to add to wishlist"
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
};

export const useRemoveWishlistMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeFromWishlistApi,
    onError: (err) => {
      alert(
        axios.isAxiosError(err)
          ? err?.response?.data?.message || "Failed to remove from wishlist"
          : "Failed to remove from wishlist"
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
};

export const useClearWishlistMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clearWishlistApi,
    onError: (err) => {
      alert(
        axios.isAxiosError(err)
          ? err?.response?.data?.message || "Failed to clear wishlist"
          : "Failed to clear wishlist"
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
};

// ------------------------------------------------------------------------

// Review
export const useCreateReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReviewApi,
    onError: (err) => {
      alert(
        axios.isAxiosError(err)
          ? err?.response?.data?.message
          : "Failed to review products"
      );
    },
    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["product-reviews"] }),
        queryClient.invalidateQueries({ queryKey: ["user-reviews"] }),
      ]);
    },
  });
};

export const useUpdateReviewMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateReviewApi,
    onError: (err) => {
      alert(
        axios.isAxiosError(err)
          ? err?.response?.data?.message
          : "Failed to update review"
      );
    },
    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["product-reviews"] }),
        queryClient.invalidateQueries({ queryKey: ["user-reviews"] }),
      ]);
    },
  })
}
 
export const useDeleteReviewMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteReviewApi,
    onError: (err) => {
      alert(
        axios.isAxiosError(err)
          ? err?.response?.data?.message
          : "Failed to update review"
      );
    },
    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["product-reviews"] }),
        queryClient.invalidateQueries({ queryKey: ["user-reviews"] }),
      ]);
    },
  })
}