"use server";

import { 
  createOrder, 
  createDineInOrder,
  type CreateDineInOrderPayload,
  type CreateOrderPayload, 
  type OrderItemPayload 
} from "@/api/orders/orders";
import { getBranches } from "@/api/branches/branches";



export async function getBranchesAction(restaurantSlug: string) { 
    const response = await getBranches(restaurantSlug);
    return response ; 
}

export async function createDineInOrderAction(
    tableUlid: string | number,
    data: CreateDineInOrderPayload
) {
  console.log(`TABLE ULID IN THE CREATE DINE IN ORDER IS : ${tableUlid}`)
    try {
        return await createDineInOrder(tableUlid, data);
    } catch (error: any) {
        throw new Error(error?.message || "حدث خطأ أثناء إنشاء الطلب.");
    }
}


export type {
    CreateOrderPayload,
    CreateDineInOrderPayload,
    OrderItemPayload,
};