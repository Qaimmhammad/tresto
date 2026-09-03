"use client";

import { useState } from "react";
import { CalendarDays, Loader2, ShoppingBag } from "lucide-react";

import  getOrdersAction  from "./get-orders-action";

type OrdersClientProps = {
    initialOrders: any[];
    branchId?: string;
};

export default function OrdersClient({
    initialOrders,
    branchId,
}: OrdersClientProps) {
    const [orders, setOrders] = useState(initialOrders);
    const [selectedDate, setSelectedDate] = useState("today");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleDateChange(date: string) {
        setSelectedDate(date);
        setLoading(true);
        setError(null);

        try {
            const newOrders = await getOrdersAction(date);
            setOrders(newOrders);
        } catch {
            setError("حدث خطأ أثناء تحميل الطلبات.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="space-y-4">
            {/* Date filter */}
            <div className="flex flex-col gap-3 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-bold text-gray-950">
                        الطلبات
                    </h2>

                    <p className="mt-1 text-xs font-medium text-gray-500">
                        اختر اليوم لعرض الطلبات الخاصة به.
                    </p>
                </div>

                <div className="relative">
                    <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                    <input
                        type="date"
                        value={
                            selectedDate === "today"
                                ? new Date().toISOString().split("T")[0]
                                : selectedDate
                        }
                        onChange={(e) => handleDateChange(e.target.value)}
                        className="h-10 rounded-xl border border-gray-200 bg-[#FAF8F5] pr-9 pl-3 text-sm font-medium text-gray-700 outline-none transition focus:border-[#B42318] focus:ring-2 focus:ring-[#B42318]/10"
                    />
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {error}
                </div>
            )}

            {/* Loading */}
            {loading ? (
                <div className="flex min-h-64 items-center justify-center rounded-2xl border border-gray-200/80 bg-white shadow-sm">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-500">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        جاري تحميل الطلبات...
                    </div>
                </div>
            ) : orders.length === 0 ? (
                /* Zero orders */
                <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-gray-200/80 bg-white px-6 text-center shadow-sm">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#B42318]/10">
                        <ShoppingBag className="h-7 w-7 text-[#B42318]" />
                    </div>

                    <h3 className="mt-4 text-base font-bold text-gray-950">
                        لا توجد طلبات
                    </h3>

                    <p className="mt-1 max-w-sm text-sm font-medium text-gray-500">
                        لا توجد أي طلبات في التاريخ المحدد.
                    </p>
                </div>
            ) : (
                /* Orders */
                <div className="space-y-3">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-950">
                                        طلب #{order.id}
                                    </h3>

                                    <p className="mt-1 text-xs font-medium text-gray-500">
                                        {order.orderType}
                                    </p>
                                </div>

                                <span className="text-sm font-bold text-gray-950">
                                    {order.totalPrice?.toLocaleString()} د.ع
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
