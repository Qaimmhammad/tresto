"use client";

import { ShoppingCart } from "lucide-react";

type Props = {
    totalPrice: number;
    itemCount: number;
    onViewOrder: () => void;
};

export function CartFooter({ totalPrice, itemCount, onViewOrder }: Props) {
    if (itemCount === 0) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto z-50">
            <button
                type="button"
                onClick={onViewOrder}
                className="w-full bg-primary text-primary-foreground py-3.5 px-5 rounded-full flex items-center justify-between shadow-lg hover:bg-primary/90 transition-all active:scale-[0.98]"
            >
                <div className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    <span className="font-bold text-sm">عرض الطلب</span>
                </div>

                <span className="font-bold text-sm bg-primary-foreground/15 px-3 py-1 rounded-full dir-ltr">
                    {totalPrice} <span className="text-[10px]">ر.س</span>
                </span>
            </button>
        </div>
    );
}