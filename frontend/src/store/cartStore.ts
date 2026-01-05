import { create } from "zustand";
import type { IProduct } from "../utils/types";
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
    product: IProduct;
    quantity: number;
    variantSku: string;
    price: number
}

export interface CartState {
    items: CartItem[];
    getTotalQuantity: () => number;
    addItem: (item: CartItem) => void;
    removeItem: (productId: string, variantSku: string) => void;
    updateQuantity: (productId: string, variantSku: string, quantity: number) => void;
    clearCart: () => void;
    getTotalPrice: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      getTotalQuantity: () => get().items.reduce((total, item) => total + item.quantity, 0),

      addItem: (newItem) => {
        const items = get().items;
        const existingItem = items.find((item) => item.product._id === newItem.product._id && item.variantSku === newItem.variantSku)

        if (existingItem) {
          const updatedItems = items.map((item) => {
            return (item.product._id === newItem.product._id && item.variantSku === newItem.variantSku) ? { ...item, quantity: item.quantity + newItem.quantity } : item
          })
          set ({ items: updatedItems })
        } else {
          set({ items: [...items, newItem] });
        }
      },

      removeItem: (productId, variantSku) => {
        set({ 
          items: get().items.filter(
            (item) => !(item.product._id === productId && item.variantSku === variantSku)
          ) 
        });
      },

      updateQuantity: (productId, variantSku, qty) => {
        set({
          items: get().items.map((item) =>
            (item.product._id === productId && item.variantSku === variantSku) 
              ? { ...item, quantity: Math.max(1, qty) } 
              : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const variant = item.product.variants.find(v => v.sku === item.variantSku);
          const baseVariantPrice = variant ? variant.price : item.product.price;
          const finalPrice = (item.product.discountPrice && item.product.discountPrice < baseVariantPrice) ? item.product.discountPrice : baseVariantPrice
          return total + (finalPrice * item.quantity);
        }, 0);
      },
    }),
    {
      name: 'shopping-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
