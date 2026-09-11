import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import OrderModel from "@/models/order-model";
import { MealOption } from "@/models/meal-model";
import {
  OrderItemPayload as ApiOrderItemPayload,
  CreateOrderPayload,
  CreateDineInOrderPayload
} from "@/api/orders/orders";
import { createOrderAction, createDineInOrderAction, getOrdersAction } from "./create-order-action";

export type OrderItemPayload = ApiOrderItemPayload & {
  // Extended fields for local UI state
  name?: string;
  price?: number;
};

export type { CreateOrderPayload, CreateDineInOrderPayload };

export interface OrderState {
  // Cart State
  cart: OrderItemPayload[];

  // API State
  orders: OrderModel[];
  isLoading: boolean;
  error: string | null;

  // Cart Actions
  addItem: (item: OrderItemPayload) => void;
  removeItem: (mealId: string) => void;
  updateQuantity: (mealId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;

  // API Actions
  fetchOrders: (period?: string | null) => Promise<void>;
  submitOrder: (branchId: string | number, data: CreateOrderPayload) => Promise<any>;
  submitDineInOrder: (tableId: string | number, data: CreateDineInOrderPayload) => Promise<any>;
}

// ================= ZUSTAND STORE =================

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      cart: [],
      orders: [],
      isLoading: false,
      error: null,

      // --- CART ACTIONS ---

      addItem: (newItem) => {
        set((state) => {
          const existingIndex = state.cart.findIndex(
            (item) => item.mealId === newItem.mealId
          );

          if (existingIndex > -1) {
            const updatedCart = [...state.cart];
            const existingItem = updatedCart[existingIndex];

            updatedCart[existingIndex] = {
              ...existingItem,
              quantity: existingItem.quantity + newItem.quantity,
              // تحديث السعر والاسم إذا تم تمريرهما مجدداً
              price: newItem.price ?? existingItem.price,
              name: newItem.name ?? existingItem.name,
            };

            return { cart: updatedCart };
          }

          return { cart: [...state.cart, newItem] };
        });
      },

      removeItem: (mealId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.mealId !== mealId),
        }));
      },

      updateQuantity: (mealId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return { cart: state.cart.filter((item) => item.mealId !== mealId) };
          }
          return {
            cart: state.cart.map((item) =>
              item.mealId === mealId ? { ...item, quantity } : item
            ),
          };
        });
      },

      clearCart: () => set({ cart: [] }),

      getCartTotal: () => {
        return get().cart.reduce((total, item) => {
          const itemPrice = item.price || 0;
          return total + itemPrice * item.quantity;
        }, 0);
      },

      // --- API ACTIONS ---

      fetchOrders: async (period = null) => {
        set({ isLoading: true, error: null });
        try {
          const orders = await getOrdersAction(period);
          set({ orders, isLoading: false });
        } catch (err: any) {
          set({
            error: err?.message || "Failed to fetch orders",
            isLoading: false,
          });
        }
      },

      submitOrder: async (branchId, data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await createOrderAction(branchId, data);
          set({ isLoading: false });
          get().clearCart();
          return response;
        } catch (err: any) {
          set({
            error: err?.message || "Failed to create order",
            isLoading: false,
          });
          throw err;
        }
      },

      submitDineInOrder: async (tableId, data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await createDineInOrderAction(tableId, data);
          set({ isLoading: false });
          get().clearCart();
          return response;
        } catch (err: any) {
          set({
            error: err?.message || "Failed to create dine-in order",
            isLoading: false,
          });
          throw err;
        }
      },
    }),
    {
      name: "tresto-order-storage",
      storage: createJSONStorage(() => localStorage),
      // Only persist cart items to localStorage, omit temporary API flags
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);