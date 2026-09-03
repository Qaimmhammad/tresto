"use client";

import { useState } from "react";
import { ArrowRight, Utensils, ShoppingBag, Truck, Loader2 } from "lucide-react";
import Link from "next/link";
import { createOrder } from "@/api/orders/orders"  ;
import { CreateOrderPayload , OrderItemPayload} from "@/api/orders/orders";

export type CartItem = {
    mealId: string;
    name: string;
    price: number;
    quantity: number;
    selectedOptions?: any[];
};

type Props = {
    cartItems?: CartItem[];
    branches?: { id: string | number; name: string }[];
};

export default function CheckoutPage({ 
    cartItems = [], 
    branches = [{ id: "1", name: "الفرع الرئيسي" }] 
}: Props) {
    const [selectedBranchId, setSelectedBranchId] = useState<string | number>(branches[0]?.id || "");
    const [orderType, setOrderType] = useState<"dine_in" | "takeaway" | "delivery">("dine_in");
    const [tableId, setTableId] = useState<string>("");
    const [notes, setNotes] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const itemsPayload: OrderItemPayload[] = cartItems.map((item) => ({
            mealId: item.mealId,
            quantity: item.quantity,
            selectedOptions: item.selectedOptions,
        }));

        try {
            
                await createOrder(selectedBranchId, {
                    items: itemsPayload,
                    notes: notes || undefined,
                    totalAmount: totalAmount,
                });

            alert("تم إرسال الطلب بنجاح!");
        } catch (err: any) {
            setError(err?.message || "حدث خطأ أثناء إرسال الطلب.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background max-w-md mx-auto border-x pb-12">
            <header className="p-4 border-b flex items-center justify-between">
                <Link href="/menu" className="p-2 hover:bg-accent rounded-lg transition-colors">
                    <ArrowRight className="w-5 h-5" />
                </Link>
                <h1 className="font-bold text-base">إتمام الطلب</h1>
                <div className="w-9" />
            </header>

            <form onSubmit={handleSubmit} className="p-4 space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground block">نوع الطلب</label>
                    <div className="grid grid-cols-3 gap-2">
                        <button
                            type="button"
                            onClick={() => setOrderType("dine_in")}
                            className={`p-3 rounded-xl border flex flex-col items-center gap-1 text-xs font-bold ${
                                orderType === "dine_in" ? "border-primary bg-primary/10 text-primary" : "bg-card"
                            }`}
                        >
                            <Utensils className="w-4 h-4" /> محلي
                        </button>
                        <button
                            type="button"
                            onClick={() => setOrderType("takeaway")}
                            className={`p-3 rounded-xl border flex flex-col items-center gap-1 text-xs font-bold ${
                                orderType === "takeaway" ? "border-primary bg-primary/10 text-primary" : "bg-card"
                            }`}
                        >
                            <ShoppingBag className="w-4 h-4" /> سفري
                        </button>
                        <button
                            type="button"
                            onClick={() => setOrderType("delivery")}
                            className={`p-3 rounded-xl border flex flex-col items-center gap-1 text-xs font-bold ${
                                orderType === "delivery" ? "border-primary bg-primary/10 text-primary" : "bg-card"
                            }`}
                        >
                            <Truck className="w-4 h-4" /> توصيل
                        </button>
                    </div>
                </div>

                {orderType === "dine_in" ? (
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground block">معرف/رقم الطاولة</label>
                        <input
                            type="text"
                            placeholder="أدخل رقم أو معرف الطاولة"
                            value={tableId}
                            onChange={(e) => setTableId(e.target.value)}
                            required
                            className="w-full p-3 bg-muted/40 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                ) : (
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground block">اختر الفرع</label>
                        <select
                            value={selectedBranchId}
                            onChange={(e) => setSelectedBranchId(e.target.value)}
                            className="w-full p-3 bg-muted/40 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            {branches.map((b) => (
                                <option key={b.id} value={b.id}>
                                    {b.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground block">ملاحظات على الطلب</label>
                    <textarea
                        placeholder="أي تعليمات إضافية للتحضير..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        className="w-full p-3 bg-muted/40 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                </div>

                <div className="space-y-2 pt-2 border-t">
                    <label className="text-xs font-bold text-muted-foreground block">ملخص الوجبات ({cartItems.length})</label>
                    <div className="bg-muted/30 p-3 rounded-xl border text-xs space-y-2">
                        {cartItems.map((item, idx) => (
                            <div key={item.mealId + idx} className="flex justify-between items-center">
                                <span>
                                    {item.name} <span className="text-muted-foreground">x{item.quantity}</span>
                                </span>
                                <span className="font-bold">{item.price * item.quantity} ر.س</span>
                            </div>
                        ))}
                        <div className="border-t pt-2 flex justify-between font-bold text-sm text-primary">
                            <span>المجموع الكلي</span>
                            <span>{totalAmount} ر.س</span>
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
                    disabled={loading || cartItems.length === 0}
                    className="w-full bg-primary text-primary-foreground py-3.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    تأكيد وإرسال الطلب
                </button>
            </form>
        </div>
    );
}