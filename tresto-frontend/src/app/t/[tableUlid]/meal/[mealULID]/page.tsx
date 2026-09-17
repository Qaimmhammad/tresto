import { notFound } from "next/navigation";

import { getMeal } from "@/api/meals/meals";
import MealDetailsClient from "./meal-details-client";

type MealPageProps = {
    params: Promise<{
        restaurantSlug: string;
        mealULID: string;
    }>;
};

export default async function MealPage({
    params,
}: MealPageProps) {
    const { restaurantSlug, mealULID } =
        await params;

    let meal;

    try {
        meal = await getMeal(mealULID);
    } catch {
        notFound();
    }

    if (!meal) {
        notFound();
    }

    return (
        <main
            dir="rtl"
            className="min-h-screen bg-[#FAF8F5]"
        >
            <MealDetailsClient
                meal={meal}
                slug={restaurantSlug}
            />
        </main>
    );
}