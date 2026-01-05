import { axiosInstance } from "./axios.instance"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const processPaymentApi = async (data: any) => {
    const response = await axiosInstance.post("/payments/process", data)
    return response.data
}

