"use server";
import { CreateMealPayload, getRestaurantMeals, updateMeal } from "@/api/meals/meals";
import { createMeal } from "@/api/meals/meals";
import serverFetch from "@/api/server-client";
import { uploadMealImage } from "@/helpers/upload-image";
import Meal from "@/models/meal-model";

export async function getMealsAction() : Promise<Meal[]> {
    const response = await getRestaurantMeals();
    return response.data.map((meal: any) => ({
        id: meal.id,
        name: meal.name,
        description: meal.description,
        price: meal.price,
        categoryId: meal.category_id,
        imageUrl: meal.image_url,
        isAvailable: meal.is_available,
        options: meal.options,
    }));
}

export async function createMealAction(
    data: CreateMealPayload
) {
    return await createMeal(data);
}

export async function uploadMealImageAction(
    image: File
): Promise<string> {
    return uploadMealImage(image);
}

export async function deleteMealAction(mealId: string | number) {
    return await serverFetch(`/meals/${mealId}`, {
        method: "DELETE"
    });
}


export async function updateMealAction(meal: Meal) {
    return await updateMeal(meal.id, meal)
}