import { RestaurantResponse } from "@/app/r/[restaurantSlug]/public-menu-client";
import serverFetch from "../server-client";

export default async function getRestaurantBySlug(slug: string) {
    return serverFetch<RestaurantResponse>(`/restaurant/slug?slug=${slug}`);
}