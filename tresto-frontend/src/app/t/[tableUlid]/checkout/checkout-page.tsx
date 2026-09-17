"use client";

import { useState } from "react";
import {
    ArrowRight,
    Loader2,
    User,
} from "lucide-react";
import Link from "next/link";
import {
    createDineInOrderAction,
    type OrderItemPayload,
} from "./action";
import { useOrderStore } from "@/app/stores/use-order-store";

type CheckOutProps = {
    tableId: string;
};

export default function CheckoutPage({
    tableId,
}: CheckOutProps) {
    const cartItems = useOrderStore((state) => state.cart);
    const totalAmount = useOrderStore((state) => state.getCartTotal());
    const clearCart = useOrderStore((state) => state.clearCart);

    const [customerName, setCustomerName] = useState("");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!customerName.trim()) {
            setError("يرجى إدخال اسم العميل.");
            return;
        }

        if (cartItems.length === 0) {
            setError("السلة فارغة.");
            return;
        }

        setLoading(true);

        const itemsPayload: OrderItemPayload[] = cartItems.map((item) => ({
            mealId: item.mealId,
            quantity: item.quantity,
            selectedOptions: item.selectedOptions,
        }));

        try {
            console.log("SENDING TABLE ID:", tableId);

            await createDineInOrderAction(tableId, {
                customerName: customerName.trim(),
                description: notes.trim() || undefined,
                items: itemsPayload,
            });

            clearCart();

            alert("تم إرسال الطلب بنجاح!");
        } catch (err: any) {
            setError(
                err?.message || "حدث خطأ أثناء إرسال الطلب."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen w-full bg-background border-x pb-12"
            dir="rtl"
        >
            <header className="p-4 border-b flex items-center justify-between max-w-xl mx-auto">
                <Link
                    href={`/t/${tableId}`}
                    className="p-2 hover:bg-accent rounded-lg transition-colors"
                >
                    <ArrowRight className="w-5 h-5" />
                </Link>

                <h1 className="font-bold text-base">
                    إتمام الطلب
                </h1>

                <div className="w-9" />
            </header>

            <form
                onSubmit={handleSubmit}
                className="p-4 space-y-6 max-w-xl mx-auto"
            >
                <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        اسم العميل
                        <span className="text-destructive">*</span>
                    </label>

                    <input
                        type="text"
                        placeholder="أدخل اسمك الكامل"
                        value={customerName}
                        onChange={(e) =>
                            setCustomerName(e.target.value)
                        }
                        required
                        className="w-full p-3 bg-muted/40 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground block">
                        ملاحظات على الطلب (اختياري)
                    </label>

                    <textarea
                        placeholder="أي تعليمات إضافية للتحضير..."
                        value={notes}
                        onChange={(e) =>
                            setNotes(e.target.value)
                        }
                        rows={3}
                        className="w-full p-3 bg-muted/40 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                </div>

                <div className="space-y-2 pt-2 border-t">
                    <label className="text-xs font-bold text-muted-foreground block">
                        ملخص الوجبات ({cartItems.length})
                    </label>

                    <div className="bg-muted/30 p-4 rounded-xl border text-xs space-y-2.5">
                        {cartItems.map((item, idx) => (
                            <div
                                key={item.mealId + idx}
                                className="flex justify-between items-center"
                            >
                                <span>
                                    {item.name}{" "}
                                    <span className="text-muted-foreground font-semibold">
                                        x{item.quantity}
                                    </span>
                                </span>

                                <span className="font-bold">
                                    {(item.price || 0) *
                                        item.quantity}{" "}
                                    د.ع
                                </span>
                            </div>
                        ))}

                        <div className="border-t pt-3 flex justify-between font-bold text-sm text-primary">
                            <span>المجموع الكلي</span>

                            <span>
                                {totalAmount} د.ع
                            </span>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-xl">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={
                        loading ||
                        cartItems.length === 0
                    }
                    className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-md"
                >
                    {loading && (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    )}

                    تأكيد وإرسال الطلب
                </button>
            </form>
        </div>
    );
}