"use server";

import {
    getOrder,
    updateOrderStatus,
    type OrderStatus,
} from "@/api/orders/orders";

export async function getOrderAction(
    orderId: string
) {
    return getOrder(orderId);
}

export async function updateOrderStatusAction(
    orderId: string,
    status: OrderStatus
) {
    return updateOrderStatus(orderId, status);
}