"use server"
import serverFetch from "@/api/server-client"
import Category from "@/models/category-model";
import Meal from "@/models/meal-model";


type PublicDataResponse = {
    meals: Meal[],
    categories: Category[]
}


export default async function getDataAction(slug: string) {
    const response = await serverFetch<PublicDataResponse>(`/restaurant/public-data?slug=${slug}`);
    return {
        "meals" : response.meals,
        "categories" : response.categories
    }   
}