import PublicMenuClient from "./public-menu-client";
import getRestaurantBySlug from "@/api/restaurant/get-restaurant-by-slug";

type Props = {
    params: Promise<{
        restaurantSlug: string;
    }>;
};

export default async function RestaurantPage({
    params,
}: Props) {
    const { restaurantSlug } = await params;

    const data = await getRestaurantBySlug(
        restaurantSlug
    ); 

    return (
        <PublicMenuClient data={data} slug={restaurantSlug} />
    );
}