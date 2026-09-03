import serverFetch from "../server-client";
import OrderModel from "@/models/order-model";
import { MealOption } from "@/models/meal-model";

export type OrderItemPayload = {
  mealId: string,
  quantity: number,
  selectedOptions?: MealOption[]
}

export type CreateOrderPayload = {
  items: OrderItemPayload[]
  notes?: string
  totalAmount?: number
}

export type CreateDineInOrderPayload = {
  items: OrderItemPayload[]
  notes?: string
}

export async function createOrder(
  branchId: string | number,
  data: CreateOrderPayload
) {
  return serverFetch(
    `/restaurant/orders/${branchId}`,
    {
      method: "POST",
      body: JSON.stringify({
        items: data.items.map((item) => ({
          meal_id: item.mealId,
          quantity: item.quantity,
          selectedOptions: item.selectedOptions
        })),
        notes: data.notes,
        total_amount: data.totalAmount,
      }),
    }
  )
}

export async function createDineInOrder(
  tableId: string | number,
  data: CreateDineInOrderPayload
) {
  return serverFetch(`/t/${tableId}/orders`, {
    method: "POST",
    body: JSON.stringify({
      items: data.items.map((item) => ({
        meal_id: item.mealId,
        quantity: item.quantity,
        selectedOptions: item.selectedOptions
      })),
      notes: data.notes,
    }),
  })
}

export async function getOrders(period: string | null) {
  if (period) { 
    const response = await serverFetch(`/orders/get?period=${period}`);
    return response.data ;
  }
  else return serverFetch(`/orders/get`);
}