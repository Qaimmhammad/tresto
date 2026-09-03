


export type MealOption = {
    name: string,
    price: number
}

type Meal = { 
    id: string,
    restaurantId: string, 
    categoryId: string, 
    name: string,
    description: string | null,
    price: number,
    imageUrl: string,
    isAvailable: boolean,
    options: MealOption[]
}

export default Meal ;