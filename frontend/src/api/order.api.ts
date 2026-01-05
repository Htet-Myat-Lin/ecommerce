import { axiosInstance } from "./axios.instance"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createOrderApi = async (data: any) => {
    const response = await axiosInstance.post("/orders", data)
    return response.data
}

export const getOrderByIdApi = async (orderId: string) => {
    const response = await axiosInstance.get(`/payments/order/${orderId}`)
    return response.data
}