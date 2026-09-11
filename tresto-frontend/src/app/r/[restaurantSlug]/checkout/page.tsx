"use client";

import { useEffect, useState } from "react";
import { ArrowRight, ShoppingBag, Truck, Loader2, MapPin, Phone, User, Clock } from "lucide-react";
import Link from "next/link";
import { createOrderAction, type OrderItemPayload, type CreateOrderPayload, getBranchesAction } from "./action";
import { useOrderStore } from "@/app/stores/use-order-store";
import Branch from "@/models/branch-model";
import { useSearchParams } from "next/navigation";



export default function CheckoutPage() {
    const [branches, setBranches] = useState<Branch[]>();

    const pathParams = useSearchParams()
    const slug = pathParams.get("slug") || " "; 

    console.log(`slug is : ${slug}`);

    useEffect(() => {
        async function getBranches(restaurantSlug: string) {
            const branches = await getBranchesAction(restaurantSlug);
            setBranches(branches);
            if (branches && branches.length > 0) {
            setSelectedBranchId(branches[0].id);
        }
        }
        getBranches(slug);
    }, [slug])
    const cartItems = useOrderStore((state) => state.cart);
    const totalAmount = useOrderStore((state) => state.getCartTotal());
    const clearCart = useOrderStore((state) => state.clearCart);
    const [selectedBranchId, setSelectedBranchId] = useState<string | number >("");
    const [orderType, setOrderType] = useState<"pickup" | "delivery">("pickup");

    // Base required fields
    const [customerName, setCustomerName] = useState<string>("");

    // Delivery fields
    const [phone, setPhone] = useState<string>("");
    const [address, setAddress] = useState<string>("");

    // Takeaway arrival time
    const [arrivalTime, setArrivalTime] = useState<string>("15");

    const [notes, setNotes] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!customerName.trim()) {
            setError("يرجى إدخال اسم العميل.");
            return;
        }

        if (orderType === "delivery") {
            if (!phone.trim()) {
                setError("يرجى إدخال رقم الهاتف للتوصيل.");
                return;
            }
            if (!address.trim()) {
                setError("يرجى إدخال عنوان التوصيل.");
                return;
            }
        }

        setLoading(true);

        const itemsPayload: OrderItemPayload[] = cartItems.map((item) => ({
            mealId: item.mealId,
            quantity: item.quantity,
            selectedOptions: item.selectedOptions,
        }));

        // تجهيز الوصف بدمج وقت الوصول إن وجد مع الملاحظات
        const extraDescription = orderType === "pickup"
            ? `[وقت الوصول المتوقع: خلال ${arrivalTime} دقيقة] ${notes}`.trim()
            : notes;

        const payload: CreateOrderPayload = {
            customerName: customerName.trim(),
            customerPhoneNumber: orderType === "delivery" ? phone.trim() : undefined,
            address: orderType === "delivery" ? address.trim() : undefined,
            orderType: orderType,
            description: extraDescription || undefined,
            totalPrice: totalAmount,
            items: itemsPayload,
        };

        try {
            await createOrderAction(selectedBranchId, payload);
            clearCart();
            alert("تم إرسال الطلب بنجاح!");
        } catch (err: any) {
            setError(err?.message || "حدث خطأ أثناء إرسال الطلب.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-background border-x pb-12" dir="rtl">
            <header className="p-4 border-b flex items-center justify-between max-w-xl mx-auto">
                <Link href="/menu" className="p-2 hover:bg-accent rounded-lg transition-colors">
                    <ArrowRight className="w-5 h-5" />
                </Link>
                <h1 className="font-bold text-base">إتمام الطلب</h1>
                <div className="w-9" />
            </header>

            <form onSubmit={handleSubmit} className="p-4 space-y-6 max-w-xl mx-auto">
                {/* Order Type Selection */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground block">طريقة الاستلام</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setOrderType("pickup")}
                            className={`p-3.5 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-bold transition-all ${orderType === "pickup" ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20" : "bg-card hover:bg-accent"
                                }`}
                        >
                            <ShoppingBag className="w-5 h-5" />
                            استلام من الفرع (طلب مسبق)
                        </button>

                        <button
                            type="button"
                            onClick={() => setOrderType("delivery")}
                            className={`p-3.5 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-bold transition-all ${orderType === "delivery" ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20" : "bg-card hover:bg-accent"
                                }`}
                        >
                            <Truck className="w-5 h-5" />
                            توصيل للعنوان
                        </button>
                    </div>
                </div>

                {/* Customer Name Field */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                        <User className="w-3.5 h-3.5" /> اسم العميل <span className="text-destructive">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="أدخل اسمك الكامل"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                        className="w-full p-3 bg-muted/40 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                {/* Branch Selection */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground block">اختر الفرع</label>
                    <select
                        value={selectedBranchId}
                        onChange={(e) => setSelectedBranchId(e.target.value)}
                        className="w-full p-3 bg-muted/40 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        {branches?.map((b) => (
                            <option key={b.id} value={b.id}>
                                {b.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Dynamic Conditional Fields based on Order Type */}
                {orderType === "delivery" ? (
                    <div className="space-y-4 rounded-xl border p-4 bg-muted/20">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                                <Phone className="w-3.5 h-3.5" /> رقم الهاتف <span className="text-destructive">*</span>
                            </label>
                            <input
                                type="tel"
                                placeholder="07XXXXXXXXX"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                className="w-full p-3 bg-background border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                dir="ltr"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5" /> عنوان التوصيل الكامل <span className="text-destructive">*</span>
                            </label>
                            <textarea
                                placeholder="المنطقة، الشارع، أقرب نقطة دالة..."
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                                rows={2}
                                className="w-full p-3 bg-background border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2 rounded-xl border p-4 bg-muted/20">
                        <label className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> وقت الوصول المتوقع إلى المطعم
                        </label>
                        <select
                            value={arrivalTime}
                            onChange={(e) => setArrivalTime(e.target.value)}
                            className="w-full p-3 bg-background border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="15">خلال 15 دقيقة</option>
                            <option value="30">خلال 30 دقيقة</option>
                            <option value="45">خلال 45 دقيقة</option>
                            <option value="60">خلال ساعة</option>
                        </select>
                    </div>
                )}

                {/* Additional Notes (description) */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground block">ملاحظات على الطلب (اختياري)</label>
                    <textarea
                        placeholder="أي تعليمات إضافية للتحضير..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        className="w-full p-3 bg-muted/40 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                </div>

                {/* Order Summary */}
                <div className="space-y-2 pt-2 border-t">
                    <label className="text-xs font-bold text-muted-foreground block">ملخص الوجبات ({cartItems.length})</label>
                    <div className="bg-muted/30 p-4 rounded-xl border text-xs space-y-2.5">
                        {cartItems.map((item, idx) => (
                            <div key={item.mealId + idx} className="flex justify-between items-center">
                                <span>
                                    {item.name} <span className="text-muted-foreground font-semibold">x{item.quantity}</span>
                                </span>
                                <span className="font-bold">{(item.price || 0) * item.quantity} د.ع</span>
                            </div>
                        ))}
                        <div className="border-t pt-3 flex justify-between font-bold text-sm text-primary">
                            <span>المجموع الكلي</span>
                            <span>{totalAmount} د.ع</span>
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
                    className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-md"
                >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    تأكيد وإرسال الطلب
                </button>
            </form>
        </div>
    );
}