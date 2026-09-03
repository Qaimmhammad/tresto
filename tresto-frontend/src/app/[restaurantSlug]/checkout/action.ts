"use server";

import { 
  createOrder, 
  type CreateOrderPayload, 
  type OrderItemPayload 
} from "@/api/orders/orders";

export async function createOrderAction(
  branchId: string | number, 
  data: CreateOrderPayload
) {
  try {
    return await createOrder(branchId, data);
  } catch (error: any) {
    throw new Error(error?.message || "حدث خطأ أثناء إنشاء الطلب.");
  }
}

export type { CreateOrderPayload, OrderItemPayload };