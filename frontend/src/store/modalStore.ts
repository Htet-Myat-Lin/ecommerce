import { create } from "zustand";
import type { ModalStore } from "../utils/types";

export const useModalStore = create<ModalStore>((set) => ({
    openLoginModal: false,
    openRegisterModal: false,
    setOpenLoginModal: (open) => set({ openLoginModal: open }),
    setOpenRegisterModal: (open) => set({ openRegisterModal: open }),
}))