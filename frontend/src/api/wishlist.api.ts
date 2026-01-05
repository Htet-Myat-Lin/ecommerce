import { axiosInstance } from "./axios.instance";

export const getWishlistApi = async () => {
  const response = await axiosInstance.get("/wishlist");
  return response.data;
}

export const addToWishlistApi = async (productId: string) => {
  const response = await axiosInstance.patch(`/wishlist/${productId}/add`);
  return response.data;
}

export const removeFromWishlistApi = async (productId: string) => {
  const response = await axiosInstance.patch(`/wishlist/${productId}/remove`);
  return response.data;
}

export const clearWishlistApi = async () => {
  const response = await axiosInstance.delete("/wishlist/clear");
  return response.data;
}

export const isInWishlistApi = async (productId: string) => {
  const response = await axiosInstance.get(`/wishlist/check/${productId}`);
  return response.data;
}

