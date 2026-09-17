import serverFetch from "../server-client";
import OrderModel from "@/models/order-model";
import { MealOption } from "@/models/meal-model";

export type OrderItemPayload = {
  mealId: string;
  quantity: number;
  selectedOptions?: MealOption[];
};

export type CreateOrderPayload = {
  customerName: string;
  customerPhoneNumber?: string;
  address?: string;
  orderType: "pickup" | "delivery";
  description?: string;
  totalPrice: number;
  items: OrderItemPayload[];
};

export type CreateDineInOrderPayload = {
  customerName: string;
  description?: string;
  items: OrderItemPayload[];
};

export async function createOrder(
  branchId: string | number,
  data: CreateOrderPayload
) {
  console.log(`the branch id is : ${branchId}`);
  return serverFetch(`/branches/orders/${branchId}`, {
    method: "POST",
    body: JSON.stringify({
      customer_name: data.customerName,
      customer_phone_number: data.customerPhoneNumber || null,
      address: data.address || null,
      order_type: data.orderType,
      description: data.description || null,
      total_price: data.totalPrice,
      items: data.items.map((item) => ({
        meal_id: item.mealId,
        quantity: item.quantity,
        selected_options: item.selectedOptions || [],
      })),
    }),
  });
}

export async function createDineInOrder(
  tableId: string | number,
  data: CreateDineInOrderPayload
) {
  return serverFetch(`/t/${tableId}/orders`, {
    method: "POST",
    body: JSON.stringify({
      customer_name: data.customerName,
      description: data.description || null,
      order_type: "dine_in",
      items: data.items.map((item) => ({
        meal_id: item.mealId,
        quantity: item.quantity,
        selected_options: item.selectedOptions || [],
      })),
    }),
  });
}

export async function getOrders(period: string | null) {
  const endpoint = period ? `/orders/get?period=${period}` : `/orders/get`;
  const response: any = await serverFetch(endpoint);
  return response?.data ?? [];
}

export async function getOrder(orderId: string) {
  const response: any = await serverFetch(
    `/orders/${orderId}`
  );

  return response?.data;
}

export type OrderStatus =
  | "pending"
  | "accepted"
  | "preparing"
  | "ready"
  | "delivering"
  | "completed"
  | "rejected"
  | "cancelled";

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
) {
  const response: any = await serverFetch(
    `/orders/${orderId}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        status,
      }),
    }
  );

  return response?.data;
}
