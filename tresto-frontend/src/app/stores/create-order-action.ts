"use server";

import { createOrder, CreateOrderPayload , CreateDineInOrderPayload , getOrders , createDineInOrder } from "@/api/orders/orders";

export async function createOrderAction(
  branchId: string | number,
  data: CreateOrderPayload
) {
  const response = await createOrder(branchId, data);
  return response;
}

export async function createDineInOrderAction(
  tableId: string | number,
  data: CreateDineInOrderPayload
){
    const response = await createDineInOrder(tableId , data);
    return response;  
}

export async function getOrdersAction(period : string | null) {
    const response = await getOrders(period);
    return response;  
}