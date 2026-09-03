"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setTableCountAction } from "@/app/dashboard/tables/actions";
import { Loader2, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

type Props = {
    currentCount: number;
};

export function AddTablesForm({ currentCount }: Props) {
    const [countInput, setCountInput] = useState<string>(currentCount > 0 ? String(currentCount) : "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const parsedInput = parseInt(countInput, 10);
    const isValid = !isNaN(parsedInput) && parsedInput > 0 && Number.isInteger(parsedInput);
    const difference = isValid ? parsedInput - currentCount : 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!isValid) {
            setError("يرجى إدخال رقم صحيح أكبر من الصفر.");
            return;
        }

        if (parsedInput < currentCount) {
            setError("تقليل عدد الطاولات يتطلب حذفاً يدوياً لمنع إزالة بيانات سابقة بالخطأ.");
            return;
        }

        if (difference === 0) {
            setError("عدد الطاولات الحالي مطابق للعدد المدخل.");
            return;
        }

        setLoading(true);

        const res = await setTableCountAction(parsedInput);

        setLoading(false);

        if (res.success) {
            router.push("/dashboard/tables");
            router.refresh();
        } else {
            setError(res.message || "حدث خطأ أثناء إضافة الطاولات.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 rounded-xl border bg-card space-y-6">
            <div className="space-y-2">
                <label htmlFor="count" className="text-sm font-medium leading-none">
                    كم عدد الطاولات الموجودة في المطعم؟
                </label>
                <input
                    id="count"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="مثال: 35"
                    value={countInput}
                    onChange={(e) => setCountInput(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={loading}
                />
            </div>

            <div className="p-4 rounded-lg bg-muted/50 border text-sm space-y-2">
                <div className="flex justify-between text-muted-foreground">
                    <span>عدد الطاولات الحالي:</span>
                    <span className="font-semibold text-foreground">{currentCount}</span>
                </div>

                {isValid && (
                    <div className="flex justify-between border-t pt-2">
                        <span>النتيجة:</span>
                        <span className="font-semibold">
                            {difference > 0 ? (
                                <span className="text-emerald-600">سيتم إضافة {difference} طاولة جديدة (من {currentCount + 1} إلى {parsedInput})</span>
                            ) : difference === 0 ? (
                                <span className="text-amber-600">عدد الطاولات مكتمل بالفعل</span>
                            ) : (
                                <span className="text-destructive">تقليل الطاولات غير متاح تلقائياً</span>
                            )}
                        </span>
                    </div>
                )}
            </div>

            {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
                <Link
                    href="/dashboard/tables"
                    className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-accent transition-colors"
                >
                    إلغاء
                </Link>
                <button
                    type="submit"
                    disabled={loading || !isValid || difference <= 0}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    حفظ وتأكيد
                </button>
            </div>
        </form>
    );
}