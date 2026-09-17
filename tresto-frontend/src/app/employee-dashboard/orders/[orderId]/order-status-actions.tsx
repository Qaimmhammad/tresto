"use client";

import { useState } from "react";
import {
    Check,
    ChefHat,
    CircleCheck,
    Loader2,
    PackageCheck,
    Truck,
    X,
} from "lucide-react";

import { updateOrderStatusAction } from "./order-actions";
import type { OrderStatus } from "@/api/orders/orders";

type Props = {
    orderId: string;
    status: OrderStatus;
};

type StatusAction = {
    status: OrderStatus;
    label: string;
    icon: typeof Check;
    className: string;
};


function getStatusLabel(status: OrderStatus) {
    switch (status) {
        case "pending":
            return "قيد الانتظار";

        case "accepted":
            return "مقبول";

        case "preparing":
            return "قيد التحضير";

        case "ready":
            return "جاهز";

        case "delivering":
            return "خرج للتوصيل";

        case "completed":
            return "مكتمل";

        case "rejected":
            return "مرفوض";

        case "cancelled":
            return "ملغى";

        default:
            return status;
    }
}

function getStatusClass(status: OrderStatus) {
    switch (status) {
        case "pending":
            return "border-yellow-200 bg-yellow-50 text-yellow-700";

        case "accepted":
            return "border-blue-200 bg-blue-50 text-blue-700";

        case "preparing":
            return "border-orange-200 bg-orange-50 text-orange-700";

        case "ready":
            return "border-emerald-200 bg-emerald-50 text-emerald-700";

        case "delivering":
            return "border-purple-200 bg-purple-50 text-purple-700";

        case "completed":
            return "border-green-200 bg-green-50 text-green-700";

        case "rejected":
            return "border-red-200 bg-red-50 text-red-700";

        case "cancelled":
            return "border-gray-200 bg-gray-50 text-gray-700";

        default:
            return "border-gray-200 bg-gray-50 text-gray-700";
    }
}

function getActions(status: OrderStatus): StatusAction[] {
    switch (status) {
        case "pending":
            return [
                {
                    status: "accepted",
                    label: "قبول الطلب",
                    icon: Check,
                    className:
                        "bg-emerald-600 hover:bg-emerald-700",
                },
                {
                    status: "rejected",
                    label: "رفض الطلب",
                    icon: X,
                    className:
                        "bg-red-600 hover:bg-red-700",
                },
            ];

        case "accepted":
            return [
                {
                    status: "preparing",
                    label: "بدء التحضير",
                    icon: ChefHat,
                    className:
                        "bg-blue-600 hover:bg-blue-700",
                },
                {
                    status: "cancelled",
                    label: "إلغاء الطلب",
                    icon: X,
                    className:
                        "bg-red-600 hover:bg-red-700",
                },
            ];

        case "preparing":
            return [
                {
                    status: "ready",
                    label: "الطلب جاهز",
                    icon: PackageCheck,
                    className:
                        "bg-emerald-600 hover:bg-emerald-700",
                },
                {
                    status: "cancelled",
                    label: "إلغاء الطلب",
                    icon: X,
                    className:
                        "bg-red-600 hover:bg-red-700",
                },
            ];

        case "ready":
            return [
                {
                    status: "delivering",
                    label: "خرج للتوصيل",
                    icon: Truck,
                    className:
                        "bg-blue-600 hover:bg-blue-700",
                },
                {
                    status: "completed",
                    label: "إتمام الطلب",
                    icon: CircleCheck,
                    className:
                        "bg-emerald-600 hover:bg-emerald-700",
                },
                {
                    status: "cancelled",
                    label: "إلغاء الطلب",
                    icon: X,
                    className:
                        "bg-red-600 hover:bg-red-700",
                },
            ];

        case "delivering":
            return [
                {
                    status: "completed",
                    label: "تم التسليم",
                    icon: CircleCheck,
                    className:
                        "bg-emerald-600 hover:bg-emerald-700",
                },
                {
                    status: "cancelled",
                    label: "إلغاء الطلب",
                    icon: X,
                    className:
                        "bg-red-600 hover:bg-red-700",
                },
            ];

        case "completed":
        case "rejected":
        case "cancelled":
            return [];

        default:
            return [];
    }
}

export default function OrderStatusActions({
    orderId,
    status,
}: Props) {
    const [currentStatus, setCurrentStatus] =
        useState<OrderStatus>(status);

    const [loadingStatus, setLoadingStatus] =
        useState<OrderStatus | null>(null);

    const [error, setError] = useState<string | null>(
        null
    );

    const actions = getActions(currentStatus);

    async function handleStatusChange(
        nextStatus: OrderStatus
    ) {
        setLoadingStatus(nextStatus);
        setError(null);

        try {
            const updatedOrder =
                await updateOrderStatusAction(
                    orderId,
                    nextStatus
                );

            const updatedStatus =
                updatedOrder?.status as OrderStatus;

            setCurrentStatus(
                updatedStatus || nextStatus
            );
        } catch (error) {
            console.error(
                "Failed to update order status:",
                error
            );

            setError(
                "حدث خطأ أثناء تحديث حالة الطلب. حاول مرة أخرى."
            );
        } finally {
            setLoadingStatus(null);
        }
    }

    if (actions.length === 0 && !error) {
        return null;
    }

    return (
        <section className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm">
            <div className="mb-4">
                <h2 className="text-xl font-semibold text-black">
                    إدارة الطلب
                </h2>

                <p className="mt-1 text-base font-semibold text-gray-600">
                    اختر الإجراء المناسب للطلب.
                </p>
            </div>
            <span
                className={`shrink-0 rounded-md border px-3 py-1 text-base font-semibold ${getStatusClass(
                    currentStatus
                )}`}
            >
                {getStatusLabel(currentStatus)}
            </span>

            {error && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-base font-semibold text-red-700">
                    {error}
                </div>
            )}

            {actions.length > 0 && (
                <div className="flex flex-wrap gap-3">
                    {actions.map((action) => {
                        const Icon = action.icon;

                        const isLoading =
                            loadingStatus ===
                            action.status;

                        return (
                            <button
                                key={action.status}
                                type="button"
                                onClick={() =>
                                    handleStatusChange(
                                        action.status
                                    )
                                }
                                disabled={
                                    loadingStatus !== null
                                }
                                className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-base font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${action.className}`}
                            >
                                {isLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <Icon className="h-5 w-5" />
                                )}

                                {isLoading
                                    ? "جاري التحديث..."
                                    : action.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </section>
    );
}