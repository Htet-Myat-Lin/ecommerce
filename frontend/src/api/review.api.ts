import { axiosInstance } from "./axios.instance";

export const createReviewApi = async (data: {
  productId: string;
  rating: number;
  comment: string;
}) => {
  const response = await axiosInstance.post("/reviews", data);
  return response.data;
};

export const getProductReviewsApi = async (productId: string) => {
  const response = await axiosInstance.get(`/reviews/product/${productId}`);
  return response.data;
};

export const updateReviewApi = async (data: {
  reviewId: string;
  productId: string;
  rating: number;
  comment: string;
}) => {
  const response = await axiosInstance.patch(
    `/reviews/${data.reviewId}/product/${data.productId}`,
    { rating: data.rating, comment: data.comment }
  );
  return response.data;
};

export const deleteReviewApi = async (data: {
  reviewId: string;
  productId: string;
}) => {
  const response = await axiosInstance.delete(
    `/reviews/${data.reviewId}/product/${data.productId}`
  );
  return response.data;
};

export const getUserReviewsApi = async () => {
  const response = await axiosInstance.get(`/reviews/my-reviews`);
  return response.data;
};

export const checkExistingReviewApi = async (productId: string) => {
  const response = await axiosInstance.get(`/reviews/product/${productId}/reviews/mine`)
  return response.data
}
