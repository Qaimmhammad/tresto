"use client";

import { useState } from "react";
import { CalendarDays, Clock, Loader2, ShoppingBag, Utensils } from "lucide-react";

import getOrdersAction from "./get-orders-action";

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

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex min-h-64 items-center justify-center rounded-2xl border border-gray-200/80 bg-white shadow-sm">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-500">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        جاري تحميل الطلبات...
                    </div>
                </div>
            ) : orders.length === 0 ? (
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
                <div className="space-y-3">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="group flex flex-col justify-between gap-4 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm transition hover:border-gray-300 sm:flex-row sm:items-center"
                        >
                            <div className="flex items-start gap-3">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FAF8F5] text-[#B42318]">
                                    <Utensils className="h-5 w-5" />
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-base font-bold text-gray-950">
                                            طلب #{order.order_number ?? order.orderNumber ?? order.id.slice(0, 6)}
                                        </h3>
                                        <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                                            مكتمل
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3 text-xs font-medium text-gray-500">
                                        <span>{order.orderType || "محلي"}</span>
                                        <span>•</span>
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-3.5 w-3.5" />
                                            <span>
                                                {order.createdAt
                                                    ? new Date(order.createdAt).toLocaleTimeString("ar-IQ", {
                                                          hour: "2-digit",
                                                          minute: "2-digit",
                                                      })
                                                    : "--:--"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between border-t border-gray-100 pt-3 sm:border-0 sm:pt-0 sm:text-left">
                                <span className="text-xs font-medium text-gray-400 sm:hidden">
                                    الإجمالي
                                </span>
                                <span className="text-base font-extrabold text-[#B42318]">
                                    {order.totalPrice?.toLocaleString()} <span className="text-xs font-bold text-gray-500">د.ع</span>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}