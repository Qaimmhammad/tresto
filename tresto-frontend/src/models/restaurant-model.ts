

export type Restaurant = {
    id: string,
    status: "active" | "inactive"
}

export type RestaurantSettings = {
    id: string,
    restaurantId: string,
    title: string, 
    subtitle: string | null, 
    logoUrl: string, 
    primaryColor: string,
    secondaryColor: string | null, 
    heroImageUrl: string | null
}

