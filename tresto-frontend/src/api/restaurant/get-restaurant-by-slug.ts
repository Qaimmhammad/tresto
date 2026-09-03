import serverFetch from "../server-client";

export default async function getRestaurantBySlug(slug: string) {
    return serverFetch(`/restaurant/slug?slug=${slug}`);
}