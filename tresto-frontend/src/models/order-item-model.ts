
import { MealOption } from "./meal-model";

type OrderItem = { 
    id: string, 
    orderId: string, 
    mealId: string,
    mealName: string, 
    unitPrice: number, 
    quantity: number,
    selectedOptions: MealOption[],
    totalPrice: number
}

export default OrderItem ;