import serverFetch from "../server-client";
import { Restaurant } from "@/models/restaurant-model";

export type UpdateRestaurantPayload = {
  name?: string
  status?: string
  logo?: string
  themeColor?: string
  primaryColor?: string
}

export async function getRestaurants(): Promise<Restaurant[]> {
  return serverFetch<Restaurant[]>("/api/restaurant")
}

export async function getRestaurant(
  id: string | number
): Promise<Restaurant> {
  return serverFetch<Restaurant>(`/api/restaurant/${id}`)
}

export async function updateRestaurant(
  id: string | number,
  data: UpdateRestaurantPayload
): Promise<Restaurant> {
  return serverFetch<Restaurant>(`/api/restaurant/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      name: data.name,
      status: data.status,
      logo: data.logo,
      theme_color: data.themeColor,
      primary_color: data.primaryColor,
    }),
  })
}

export async function deleteRestaurant(
  id: string | number
): Promise<{ message: string }> {
  return serverFetch<{ message: string }>(`/api/restaurant/${id}`, {
    method: "DELETE",
  })
}