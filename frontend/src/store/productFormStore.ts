import { create } from "zustand";
import type { ProductFormStore } from "../utils/types";

export const useProductFormStore = create<ProductFormStore>((set) => ({
  currentStep: 0,
  totalSteps: 3,
  nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, s.totalSteps - 1) })),
  prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 0) })),
  setStep: (step: number) => set((s) => ({ currentStep: Math.max(0, Math.min(step, s.totalSteps - 1)) })),
  resetStep: () => set({ currentStep: 0 }),
}));