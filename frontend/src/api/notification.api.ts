import { axiosInstance } from "./axios.instance";

export interface INotification {
  _id: string;
  user: string;
  type: "MESSAGE" | "ORDER" | "SYSTEM";
  content: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getUserNotificationsApi = async () => {
  const response = await axiosInstance.get("/notifications");
  return response.data;
};

export const markAsReadApi = async (id: string) => {
  const response = await axiosInstance.patch(`/notifications/${id}/read`);
  return response.data;
};

export const markAllAsReadApi = async () => {
  const response = await axiosInstance.patch("/notifications/read-all");
  return response.data;
};

export const deleteNotificationApi = async (id: string) => {
  const response = await axiosInstance.delete(`/notifications/${id}`);
  return response.data;
};
