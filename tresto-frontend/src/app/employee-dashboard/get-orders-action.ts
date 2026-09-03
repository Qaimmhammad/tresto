"use server"
import { getOrders } from "@/api/orders/orders"

export default async function getOrdersAction(
    period: string
): Promise<any> {
    return getOrders(period);
}