import serverFetch from "../server-client"
import MealModel, { MealOption } from "@/models/meal-model"

export type CreateMealPayload = {
  categoryId: string
  name: string
  description?: string
  price: number
  isAvailable?: boolean
  imageUrl: string | null
  options?: {
    name: string;
    price: string;
  }[] | null
}

export type UpdateMealPayload = {
  categoryId?: string
  name?: string
  description?: string | null
  price?: number
  isAvailable?: boolean
  image?: string | null
}

export async function getRestaurantMeals(
) : Promise<any>{
  return serverFetch(`/meals/all`);
}

export async function createMeal(data: CreateMealPayload): Promise<MealModel> {
  return serverFetch<MealModel>("/meals", {
    method: "POST",
    body: JSON.stringify({
      category_id: data.categoryId,
      name: data.name,
      description: data.description,
      price: data.price,
      is_available: data.isAvailable,
      image_url: data.imageUrl,
      options: data.options
    }),
  })
}

export async function getMeal(
    mealId: string | number
): Promise<MealModel> {
    const response = await serverFetch<{
        data: {
            id: string;
            restaurant_id: string;
            category_id: string;
            name: string;
            description: string | null;
            price: number;
            image_url: string;
            is_available: boolean;
            options: MealOption[] | null | [];
        };
    }>(`/meals/${mealId}`);

    const meal = response.data;

    return {
        id: meal.id,
        restaurantId: meal.restaurant_id,
        categoryId: meal.category_id,
        name: meal.name,
        description: meal.description,
        price: Number(meal.price),
        imageUrl: meal.image_url,
        isAvailable: meal.is_available,
        options: meal.options ?? [],
    };
}

export async function updateMeal(
  mealId: string,
  data: UpdateMealPayload
): Promise<MealModel> {
  return serverFetch<MealModel>(`/meals/${mealId}`, {
    method: "PUT",
    body: JSON.stringify({
      category_id: data.categoryId,
      name: data.name,
      description: data.description,
      price: data.price,
      is_available: data.isAvailable,
      image: data.image,
    }),
  })
}

export async function deleteMeal(
  mealId: string
): Promise<{ message: string }> {
  return serverFetch<{ message: string }>(`/api/meals/${mealId}`, {
    method: "DELETE",
  })
}
