"use server";

import serverFetch from "@/api/server-client";
import Category from "@/models/category-model";
import Meal from "@/models/meal-model";

type DataType = {
    categories: Category[]
    meals: Meal[]
}

export async function getDataAction(slug: string) {
    const restaurantData = await serverFetch<DataType>(
        `/restaurant/public-data?slug=${slug}`
    );

    return restaurantData ;
}

