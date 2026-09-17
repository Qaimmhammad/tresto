import Link from "next/link";
import {
    ArrowRight,
    Clock,
    MapPin,
    Phone,
    ShoppingBag,
    User,
    Utensils,
} from "lucide-react";

import { getOrderAction } from "./order-actions";
import OrderStatusActions from "./order-status-actions";

type Props = {
    params: Promise<{
        orderId: string;
    }>;
};

function getStatusLabel(status?: string) {
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

function getStatusClass(status?: string) {
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
            return "border-gray-200 bg-gray-50 text-gray-700";
    }
}

function getOrderType(type?: string) {
    switch (type) {
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

export default async function OrderPage({ params }: Props) {
    const { orderId } = await params;

    const order = await getOrderAction(orderId);

    if (!order) {
        return (
            <main
                dir="rtl"
                className="min-h-screen bg-[#FAF8F5] p-4"
            >
                <div className="mx-auto max-w-4xl">
                    <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                        <h1 className="text-xl font-semibold text-black">
                            الطلب غير موجود
                        </h1>

                        <Link
                            href="/employee-dashboard"
                            className="mt-4 inline-block text-base font-semibold text-[#B42318]"
                        >
                            العودة إلى الطلبات
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    const orderNumber =
        order.order_number ??
        order.orderNumber ??
        order.id.slice(0, 6);

    const customerName =
        order.customer_name ??
        order.customerName;

    const customerPhone =
        order.customer_phone_number ??
        order.customerPhoneNumber;

    const orderType =
        order.order_type ??
        order.orderType;

    const totalPrice = Number(
        order.total_price ??
        order.totalPrice ??
        0
    );

    const tableNumber =
        order.table?.number ??
        order.table_number ??
        order.tableNumber;

    const hasDescription =
        Boolean(order.description?.trim());

    return (
        <main
            dir="rtl"
            className="min-h-screen bg-[#FAF8F5] p-4 text-right"
        >
            <div className="mx-auto w-full max-w-4xl space-y-4">
                {/* Back */}
                <Link
                    href="/employee-dashboard"
                    className="inline-flex items-center gap-2 text-base font-semibold text-black transition hover:text-[#B42318]"
                >
                    <ArrowRight className="h-5 w-5" />
                    العودة إلى الطلبات
                </Link>

                {/* Header */}
                <section className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FAF8F5] text-[#B42318]">
                                <Utensils className="h-6 w-6" />
                            </div>

                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-2xl font-semibold text-black">
                                        طلب #{orderNumber}
                                    </h1>

                                    <span
                                        className={`rounded-md border px-3 py-1 text-base font-semibold ${getStatusClass(
                                            order.status
                                        )}`}
                                    >
                                        {getStatusLabel(
                                            order.status
                                        )}
                                    </span>
                                </div>

                                <div className="mt-2 flex flex-wrap items-center gap-3 text-base font-semibold text-black">
                                    <span>
                                        {getOrderType(orderType)}
                                    </span>

                                    {tableNumber !== undefined && (
                                        <>
                                            <span>•</span>

                                            <span>
                                                طاولة{" "}
                                                {tableNumber}
                                            </span>
                                        </>
                                    )}

                                    {order.created_at && (
                                        <>
                                            <span>•</span>

                                            <span className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />

                                                {new Date(
                                                    order.created_at
                                                ).toLocaleString(
                                                    "ar-IQ",
                                                    {
                                                        dateStyle:
                                                            "medium",
                                                        timeStyle:
                                                            "short",
                                                    }
                                                )}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="text-left">
                            <div className="text-base font-semibold text-black">
                                الإجمالي
                            </div>

                            <div className="mt-1 text-2xl font-semibold text-[#B42318]">
                                {totalPrice.toLocaleString(
                                    "ar-IQ"
                                )}{" "}
                                <span className="text-base font-semibold text-black">
                                    د.ع
                                </span>
                            </div>
                        </div>
                    </div>
                </section>
                <OrderStatusActions
                    orderId={order.id}
                    status={order.status}
                />

                {/* Customer */}
                <section className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm">
                    <h2 className="mb-5 text-xl font-semibold text-black">
                        معلومات العميل
                    </h2>

                    <div className="grid gap-5 sm:grid-cols-2">
                        {customerName && (
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                                    <User className="h-5 w-5 text-black" />
                                </div>

                                <div>
                                    <div className="text-sm font-semibold text-gray-600">
                                        الاسم
                                    </div>

                                    <div className="text-base font-semibold text-black">
                                        {customerName}
                                    </div>
                                </div>
                            </div>
                        )}

                        {customerPhone && (
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                                    <Phone className="h-5 w-5 text-black" />
                                </div>

                                <div>
                                    <div className="text-sm font-semibold text-gray-600">
                                        رقم الهاتف
                                    </div>

                                    <div className="text-base font-semibold text-black">
                                        {customerPhone}
                                    </div>
                                </div>
                            </div>
                        )}

                        {order.address && (
                            <div className="flex items-center gap-3 sm:col-span-2">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                                    <MapPin className="h-5 w-5 text-black" />
                                </div>

                                <div>
                                    <div className="text-sm font-semibold text-gray-600">
                                        العنوان
                                    </div>

                                    <div className="text-base font-semibold text-black">
                                        {order.address}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="mt-6 rounded-xl border-2 border-[#B42318]/20 bg-[#FAF8F5] p-5">
                        <div className="flex items-center justify-between gap-3">
                            <h3 className="text-lg font-semibold text-black">
                                ملاحظات الطلب
                            </h3>

                            <span
                                className={`rounded-full px-3 py-1 text-sm font-semibold ${hasDescription
                                        ? "bg-emerald-100 text-emerald-800"
                                        : "bg-gray-200 text-gray-700"
                                    }`}
                            >
                                {hasDescription
                                    ? "يوجد ملاحظات"
                                    : "لا توجد ملاحظات"}
                            </span>
                        </div>

                        {hasDescription ? (
                            <p className="mt-4 rounded-lg bg-white p-4 text-base font-semibold leading-7 text-black">
                                {order.description}
                            </p>
                        ) : (
                            <p className="mt-4 text-base font-semibold text-gray-600">
                                لم يضف العميل أي ملاحظات لهذا الطلب.
                            </p>
                        )}
                    </div>
                </section>

                {/* Items */}
                <section className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm">
                    <div className="mb-5 flex items-center gap-2">
                        <ShoppingBag className="h-6 w-6 text-[#B42318]" />

                        <h2 className="text-xl font-semibold text-black">
                            تفاصيل الطلب
                        </h2>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {order.items?.map((item: any) => {
                            const mealName =
                                item.meal_name ??
                                item.mealName ??
                                "وجبة";

                            const unitPrice = Number(
                                item.unit_price ??
                                item.unitPrice ??
                                0
                            );

                            const itemTotal = Number(
                                item.total_price ??
                                item.totalPrice ??
                                unitPrice *
                                item.quantity
                            );

                            const options =
                                item.selected_options ??
                                item.selectedOptions ??
                                [];

                            return (
                                <div
                                    key={item.id}
                                    className="py-5 first:pt-0 last:pb-0"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0 flex-1">
                                            {/* Meal */}
                                            <div className="flex items-center gap-3">
                                                <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-[#B42318]/10 px-2 text-base font-semibold text-[#B42318]">
                                                    {item.quantity}
                                                </span>

                                                <h3 className="text-lg font-semibold text-black">
                                                    {mealName}
                                                </h3>
                                            </div>

                                            {/* Selected options */}
                                            <div className="mt-4 mr-12">
                                                <div className="mb-2 text-base font-semibold text-black">
                                                    الخيارات المحددة
                                                </div>

                                                {options.length > 0 ? (
                                                    <div className="space-y-2 rounded-xl border border-gray-200 bg-gray-50 p-3">
                                                        {options.map(
                                                            (
                                                                option: any,
                                                                index: number
                                                            ) => (
                                                                <div
                                                                    key={`${option.name}-${index}`}
                                                                    className="flex items-center justify-between gap-4 rounded-lg bg-white px-3 py-2.5"
                                                                >
                                                                    <span className="text-base font-semibold text-black">
                                                                        +{" "}
                                                                        {
                                                                            option.name
                                                                        }
                                                                    </span>

                                                                    <span className="text-base font-semibold text-[#B42318]">
                                                                        {Number(
                                                                            option.price
                                                                        ).toLocaleString(
                                                                            "ar-IQ"
                                                                        )}{" "}
                                                                        د.ع
                                                                    </span>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="rounded-lg bg-gray-50 px-3 py-2 text-base font-semibold text-gray-600">
                                                        لا توجد خيارات إضافية
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Item price */}
                                        <div className="shrink-0 text-left">
                                            <div className="text-lg font-semibold text-black">
                                                {itemTotal.toLocaleString(
                                                    "ar-IQ"
                                                )}{" "}
                                                <span className="text-sm font-semibold text-gray-600">
                                                    د.ع
                                                </span>
                                            </div>

                                            <div className="mt-1 text-sm font-semibold text-gray-600">
                                                {unitPrice.toLocaleString(
                                                    "ar-IQ"
                                                )}{" "}
                                                ×{" "}
                                                {item.quantity}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Total */}
                    <div className="mt-5 border-t border-gray-200 pt-5">
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-semibold text-black">
                                الإجمالي
                            </span>

                            <span className="text-2xl font-semibold text-[#B42318]">
                                {totalPrice.toLocaleString(
                                    "ar-IQ"
                                )}{" "}
                                <span className="text-base font-semibold text-black">
                                    د.ع
                                </span>
                            </span>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
