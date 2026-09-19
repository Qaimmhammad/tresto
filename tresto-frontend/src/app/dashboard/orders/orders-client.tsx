"use client";

import Link from "next/link";
import { useState } from "react";
import {
    CalendarDays,
    Clock,
    Loader2,
    ShoppingBag,
    User,
    Utensils,
} from "lucide-react";

import getOrdersAction from "../../employee-dashboard/get-orders-action";

type OrdersClientProps = {
    initialOrders: any[];
    branchId?: string;
};

function getOrderType(order: any) {
    switch (order.order_type) {
        case "dine_in":
            return "داخل المطعم";

        case "pickup":
            return "استلام";

        case "delivery":
            return "توصيل";

        default:
            return "غير محدد";
    }
}

function getStatusLabel(status: string) {
    switch (status) {
        case "pending":
            return "بانتظار القبول";

        case "accepted":
            return "مقبول";

        case "preparing":
            return "قيد التحضير";

        case "ready":
            return "جاهز";

        case "completed":
            return "مكتمل";

        case "rejected":
            return "مرفوض";

        case "cancelled":
            return "ملغي";

        default:
            return "غير معروف";
    }
}

function getStatusClass(status: string) {
    switch (status) {
        case "pending":
            return "border-amber-200 bg-amber-50 text-amber-700";

        case "accepted":
        case "preparing":
            return "border-blue-200 bg-blue-50 text-blue-700";

        case "ready":
        case "completed":
            return "border-emerald-200 bg-emerald-50 text-emerald-700";

        case "rejected":
        case "cancelled":
            return "border-red-200 bg-red-50 text-red-700";

        default:
            return "border-gray-200 bg-gray-50 text-gray-600";
    }
}

export default function OrdersClient({
    initialOrders,
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
            {/* Header */}
            <div className="flex flex-col gap-3 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-bold text-gray-950">
                        الطلبات
                    </h2>

                    <p className="mt-1 text-xs font-medium text-gray-500">
                        اختر الفترة لعرض الطلبات الخاصة بها.
                    </p>
                </div>

                <div className="relative w-full sm:w-auto">
                    <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                    <select
                        value={selectedDate}
                        onChange={(e) =>
                            handleDateChange(e.target.value)
                        }
                        disabled={loading}
                        className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-sm font-semibold text-gray-700 outline-none transition focus:border-[#B42318] focus:ring-2 focus:ring-[#B42318]/10 disabled:cursor-not-allowed disabled:opacity-60 sm:w-44"
                    >
                        <option value="today">اليوم</option>
                        <option value="week">هذا الأسبوع</option>
                        <option value="month">هذا الشهر</option>
                    </select>
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
                    <div className="flex text-2xl font-semibold items-center gap-2 text-gray-800">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        جاري تحميل الطلبات...
                    </div>
                </div>
            ) : orders.length === 0 ? (
                /* Empty */
                <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-gray-200/80 bg-white px-6 text-center shadow-sm">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#B42318]/10">
                        <ShoppingBag className="h-7 w-7 text-[#B42318]" />
                    </div>

                    <h3 className="mt-4 text-base font-bold text-gray-950">
                        لا توجد طلبات
                    </h3>

                    <p className="mt-1 max-w-sm text-sm font-medium text-gray-500">
                        لا توجد أي طلبات في الفترة المحددة.
                    </p>
                </div>
            ) : (
                /* Orders */
                <div className="space-y-3">
                    {orders.map((order) => {
                        const itemCount =
                            order.items?.reduce(
                                (
                                    total: number,
                                    item: any
                                ) =>
                                    total +
                                    Number(
                                        item.quantity ?? 0
                                    ),
                                0
                            ) ?? 0;

                        const totalPrice = Number(
                            order.total_price ?? 0
                        );

                        return (
                            <Link
                                key={order.id}
                                href={`/employee-dashboard/orders/${order.id}`}
                                className="group block rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm transition hover:border-gray-300 hover:shadow-md active:scale-[0.995]"
                            >
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    {/* Order information */}
                                    <div className="flex min-w-0 items-start gap-3">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FAF8F5] text-[#B42318]">
                                            <Utensils className="h-5 w-5" />
                                        </div>

                                        <div className="min-w-0 space-y-1.5">
                                            {/* Number + status */}
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="text-xl font-semibold text-black">
                                                    طلب #
                                                    {order.order_number ??
                                                        order.orderNumber ??
                                                        order.id.slice(0, 6)}
                                                </h3>

                                                <span
                                                    className={`rounded-md border px-2 py-0.5 text-base font-semibold ${getStatusClass(
                                                        order.status
                                                    )}`}
                                                >
                                                    {getStatusLabel(order.status)}
                                                </span>
                                            </div>

                                            {/* Basic info */}
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-base font-semibold text-black">
                                                <span>{getOrderType(order)}</span>

                                                {order.table?.number !== undefined && (
                                                    <>
                                                        <span>•</span>

                                                        <span>
                                                            طاولة {order.table.number}
                                                        </span>
                                                    </>
                                                )}

                                                <span>•</span>

                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4 text-black" />

                                                    <span>
                                                        {order.created_at
                                                            ? new Date(
                                                                order.created_at
                                                            ).toLocaleTimeString("ar-IQ", {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            })
                                                            : "--:--"}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Customer */}
                                            {order.customer_name && (
                                                <div className="flex items-center gap-1.5 text-base font-semibold text-black">
                                                    <User className="h-4 w-4 text-black" />

                                                    <span>
                                                        {order.customer_name}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="flex items-center justify-between border-t border-gray-100 pt-3 sm:min-w-36 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
                                        <div className="flex items-center gap-2">
                                            <ShoppingBag className="h-4 w-4 text-black" />

                                            <span className="text-base font-semibold text-black">
                                                {itemCount}{" "}
                                                {itemCount === 1
                                                    ? "عنصر"
                                                    : "عناصر"}
                                            </span>
                                        </div>

                                        <span className="text-xl font-semibold text-[#B42318]">
                                            {totalPrice.toLocaleString("ar-IQ")}{" "}
                                            <span className="text-base font-semibold text-black">
                                                د.ع
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </section>
    );
}

