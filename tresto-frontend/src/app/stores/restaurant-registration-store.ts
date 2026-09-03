import { create } from "zustand";
import { RestaurantRegistration } from "@/api/restaurant/restaurant-registration";

type RestaurantRegistrationStore = {
    data: Partial<RestaurantRegistration>;

    updateRestaurant: (
        restaurant: RestaurantRegistration["restaurant"]
    ) => void;

    updateRestaurantSettings: (
        restaurantSettings: RestaurantRegistration["restaurantSettings"]
    ) => void;

    updateAdmin: (
        admin: RestaurantRegistration["admin"]
    ) => void;

    reset: () => void;
};

export const useRestaurantRegistrationStore =
    create<RestaurantRegistrationStore>((set) => ({
        data: {},

        updateRestaurant: (restaurant) =>
            set((state) => ({
                data: {
                    ...state.data,
                    restaurant,
                },
            })),

        updateRestaurantSettings: (restaurantSettings) =>
            set((state) => ({
                data: {
                    ...state.data,
                    restaurantSettings,
                },
            })),

        updateAdmin: (admin) =>
            set((state) => ({
                data: {
                    ...state.data,
                    admin,
                },
            })),

        reset: () => set({ data: {} }),
    }));