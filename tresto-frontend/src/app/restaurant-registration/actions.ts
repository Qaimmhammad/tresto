"use server";

import restaurantRegistration, {
  RestaurantRegistration,
} from "@/api/restaurant/restaurant-registration";

export default async function registerRestaurant(
  data: RestaurantRegistration
) {
  return restaurantRegistration(data);
}