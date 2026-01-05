import { create } from "zustand";
import type { AuthStore, IUser } from "../utils/types";
import { axiosInstance } from "../api/axios.instance";

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    loading: true,
    accessToken: null,
    fetchUser: async() => {
        try{
            set({ loading: true });
            const res = await axiosInstance.get("/users/get-user");
            if (res.data && res.data.success) {
                set({ user: res.data.user } );
            } else {
                set({ user: null })
            }
        } catch (error) {
            console.error("Failed to fetch user:", error);
        } finally {
            set({ loading: false });
        }
    },
    setUser: (data: IUser | null) => set({ user: data }),
    setAccessToken: (token: string | null) => set({ accessToken: token })
}));
