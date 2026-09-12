import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import OrderModel from "@/models/order-model";
import { MealOption } from "@/models/meal-model";
import {
    OrderItemPayload as ApiOrderItemPayload,
    CreateOrderPayload,
    CreateDineInOrderPayload,
} from "@/api/orders/orders";
import {
    createOrderAction,
    createDineInOrderAction,
    getOrdersAction,
} from "./create-order-action";

export type OrderItemPayload = ApiOrderItemPayload & {
    name?: string;
    price?: number;
};

export type { CreateOrderPayload, CreateDineInOrderPayload };

function optionsEqual(
    first: MealOption[] = [],
    second: MealOption[] = []
) {
    if (first.length !== second.length) {
        return false;
    }

    const normalize = (options: MealOption[]) =>
        options
            .map((option) => ({
                name: option.name,
                price: Number(option.price),
            }))
            .sort((a, b) => {
                const nameCompare = a.name.localeCompare(b.name);
                return nameCompare || a.price - b.price;
            });

    const firstNormalized = normalize(first);
    const secondNormalized = normalize(second);

    return firstNormalized.every(
        (option, index) =>
            option.name === secondNormalized[index].name &&
            option.price === secondNormalized[index].price
    );
}

export interface OrderState {
    cart: OrderItemPayload[];
    orders: OrderModel[];
    isLoading: boolean;
    error: string | null;

    addItem: (item: OrderItemPayload) => void;
    removeItem: (
        mealId: string,
        selectedOptions?: MealOption[]
    ) => void;
    updateQuantity: (
        mealId: string,
        quantity: number,
        selectedOptions?: MealOption[]
    ) => void;
    clearCart: () => void;
    getCartTotal: () => number;

    fetchOrders: (period?: string | null) => Promise<void>;
    submitOrder: (
        branchId: string | number,
        data: CreateOrderPayload
    ) => Promise<any>;
    submitDineInOrder: (
        tableId: string | number,
        data: CreateDineInOrderPayload
    ) => Promise<any>;
}

export const useOrderStore = create<OrderState>()(
    persist(
        (set, get) => ({
            cart: [],
            orders: [],
            isLoading: false,
            error: null,

            addItem: (newItem) => {
                set((state) => {
                    const existingIndex = state.cart.findIndex(
                        (item) =>
                            item.mealId === newItem.mealId &&
                            optionsEqual(
                                item.selectedOptions,
                                newItem.selectedOptions
                            )
                    );

                    if (existingIndex > -1) {
                        const updatedCart = [...state.cart];
                        const existingItem = updatedCart[existingIndex];

                        updatedCart[existingIndex] = {
                            ...existingItem,
                            quantity:
                                existingItem.quantity +
                                newItem.quantity,
                            price:
                                newItem.price ??
                                existingItem.price,
                            name:
                                newItem.name ??
                                existingItem.name,
                        };

                        return {
                            cart: updatedCart,
                        };
                    }

                    return {
                        cart: [...state.cart, newItem],
                    };
                });
            },

            removeItem: (
                mealId,
                selectedOptions = []
            ) => {
                set((state) => ({
                    cart: state.cart.filter(
                        (item) =>
                            !(
                                item.mealId === mealId &&
                                optionsEqual(
                                    item.selectedOptions,
                                    selectedOptions
                                )
                            )
                    ),
                }));
            },

            updateQuantity: (
                mealId,
                quantity,
                selectedOptions = []
            ) => {
                set((state) => {
                    if (quantity <= 0) {
                        return {
                            cart: state.cart.filter(
                                (item) =>
                                    !(
                                        item.mealId === mealId &&
                                        optionsEqual(
                                            item.selectedOptions,
                                            selectedOptions
                                        )
                                    )
                            ),
                        };
                    }

                    return {
                        cart: state.cart.map((item) =>
                            item.mealId === mealId &&
                            optionsEqual(
                                item.selectedOptions,
                                selectedOptions
                            )
                                ? {
                                      ...item,
                                      quantity,
                                  }
                                : item
                        ),
                    };
                });
            },

            clearCart: () => set({ cart: [] }),

            getCartTotal: () => {
                return get().cart.reduce(
                    (total, item) =>
                        total +
                        (item.price || 0) *
                            item.quantity,
                    0
                );
            },

            fetchOrders: async (period = null) => {
                set({
                    isLoading: true,
                    error: null,
                });

                try {
                    const orders =
                        await getOrdersAction(period);

                    set({
                        orders,
                        isLoading: false,
                    });
                } catch (err: any) {
                    set({
                        error:
                            err?.message ||
                            "Failed to fetch orders",
                        isLoading: false,
                    });
                }
            },

            submitOrder: async (
                branchId,
                data
            ) => {
                set({
                    isLoading: true,
                    error: null,
                });

                try {
                    const response =
                        await createOrderAction(
                            branchId,
                            data
                        );

                    set({
                        isLoading: false,
                    });

                    get().clearCart();

                    return response;
                } catch (err: any) {
                    set({
                        error:
                            err?.message ||
                            "Failed to create order",
                        isLoading: false,
                    });

                    throw err;
                }
            },

            submitDineInOrder: async (
                tableId,
                data
            ) => {
                set({
                    isLoading: true,
                    error: null,
                });

                try {
                    const response =
                        await createDineInOrderAction(
                            tableId,
                            data
                        );

                    set({
                        isLoading: false,
                    });

                    get().clearCart();

                    return response;
                } catch (err: any) {
                    set({
                        error:
                            err?.message ||
                            "Failed to create dine-in order",
                        isLoading: false,
                    });

                    throw err;
                }
            },
        }),
        {
            name: "tresto-order-storage",
            storage: createJSONStorage(
                () => localStorage
            ),
            partialize: (state) => ({
                cart: state.cart,
            }),
        }
    )
);