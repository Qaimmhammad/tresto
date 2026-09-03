import OrdersClient from "./orders-client";
import Header from "../components/header";

import { getCurrentUser } from "../api/auth/user";
import { getOrders } from "@/api/orders/orders";

export default async function OrdersPage() {
    const [orders, user] = await Promise.all([
        getOrders("today"),
        getCurrentUser(),
    ]);

    return (
        <main
            dir="rtl"
            className="min-h-screen bg-[#FAF8F5] p-4 text-right"
        >
            <div className="mx-auto w-full max-w-5xl space-y-6">
                <Header />

                <OrdersClient
                    initialOrders={orders}
                    branchId={user?.branch?.branchId}
                />
            </div>
        </main>
    );
}
