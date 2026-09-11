"use server";

import { 
  createOrder, 
  type CreateOrderPayload, 
  type OrderItemPayload 
} from "@/api/orders/orders";
import { getBranches } from "@/api/branches/branches";



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

export async function getBranchesAction(restaurantSlug: string) { 
    const response = await getBranches(restaurantSlug);
    return response ; 
}


export type { CreateOrderPayload, OrderItemPayload };