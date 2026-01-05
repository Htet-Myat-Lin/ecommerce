import type { FieldValues } from "react-hook-form";
import { axiosInstance } from "./axios.instance";

export const registerApi = async (registrationData: FieldValues) => {
    const response = await axiosInstance.post("/auth/register", registrationData);
    return response.data;
}

export const loginApi = async (credentials: FieldValues) => {
    const response = await axiosInstance.post("/auth/login", credentials);
    return response.data;
}

export const logoutApi = async () => {
    const response = await axiosInstance.get("/auth/logout");
    return response.data;
}

export const sendEmailVerifyOTPApi = async (email: string) => {
    const response = await axiosInstance.post("/auth/send-verify-email-otp", {email})
    return response.data
}

export const verifyEmailApi = async (data: FieldValues ) => {
    const response = await axiosInstance.post("/auth/verify-email", data)
    return response.data
}

export const forgotPasswordApi = async (data: FieldValues) => {
    const response = await axiosInstance.post("/auth/forgot-password", data)
    return response.data
}

export const sendResetOTPApi = async (email: string) => {
    const response = await axiosInstance.post("auth/send-reset-password-otp",{ email })
    return response.data
}

export const resetPasswordApi = async (data: FieldValues) => {
    const response = await axiosInstance.post("auth/reset-password", data)
    return response.data
}