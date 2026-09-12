"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
    ArrowRight,
    Minus,
    Plus,
    ShoppingBag,
    X,
} from "lucide-react";

import MealModel, {
    MealOption,
} from "@/models/meal-model";
import { useOrderStore } from "@/app/stores/use-order-store";

type MealDetailsClientProps = {
    meal: MealModel;
    slug: string;
};

export default function MealDetailsClient({
    meal,
    slug,
}: MealDetailsClientProps) {
    const [selectedOptions, setSelectedOptions] =
        useState<MealOption[]>([]);
    const [quantity, setQuantity] = useState(1);
    const [cartOpen, setCartOpen] = useState(false);

    const cart = useOrderStore(
        (state) => state.cart
    );

    const addItem = useOrderStore(
        (state) => state.addItem
    );

    const removeItem = useOrderStore(
        (state) => state.removeItem
    );

    const updateQuantity = useOrderStore(
        (state) => state.updateQuantity
    );

    const cartTotal = useOrderStore(
        (state) => state.getCartTotal()
    );

    const primaryColor = "#B42318";
    const primaryTextColor = "#FFFFFF";

    const optionsTotal = useMemo(
        () =>
            selectedOptions.reduce(
                (total, option) =>
                    total + Number(option.price),
                0
            ),
        [selectedOptions]
    );

    const unitPrice =
        Number(meal.price) + optionsTotal;

    const totalPrice = unitPrice * quantity;

    function toggleOption(option: MealOption) {
        setSelectedOptions((current) => {
            const exists = current.some(
                (item) =>
                    item.name === option.name &&
                    Number(item.price) ===
                        Number(option.price)
            );

            if (exists) {
                return current.filter(
                    (item) =>
                        !(
                            item.name === option.name &&
                            Number(item.price) ===
                                Number(option.price)
                        )
                );
            }

            return [...current, option];
        });
    }

    function handleAddToCart() {
        addItem({
            mealId: meal.id,
            quantity,
            selectedOptions,
            name: meal.name,
            price: unitPrice,
        });

        setQuantity(1);
        setSelectedOptions([]);
    }

    function decreaseFromCart(
        mealId: string,
        options: MealOption[] = []
    ) {
        const item = cart.find(
            (item) =>
                item.mealId === mealId &&
                JSON.stringify(
                    item.selectedOptions ?? []
                ) === JSON.stringify(options)
        );

        if (!item) {
            return;
        }

        if (item.quantity <= 1) {
            removeItem(mealId, options);
            return;
        }

        updateQuantity(
            mealId,
            item.quantity - 1,
            options
        );
    }

    function formatPrice(price: number) {
        return `${price.toLocaleString("ar-IQ")} د.ع`;
    }

    return (
        <>
            <div className="mx-auto w-full max-w-3xl px-4 pb-32 pt-5">
                <Link
                    href={`/r/${slug}`}
                    className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-gray-600"
                >
                    <ArrowRight className="h-4 w-4" />
                    العودة للقائمة
                </Link>

                <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
                    {meal.imageUrl && (
                        <div className="relative aspect-1.5/1 overflow-hidden bg-gray-100">
                            <img
                                src={meal.imageUrl}
                                alt={meal.name}
                                className="h-full w-full object-contain"
                            />

                            {!meal.isAvailable && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/45">
                                    <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-gray-800">
                                        غير متوفر حالياً
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="p-5">
                        <h1 className="text-2xl font-extrabold text-gray-950">
                            {meal.name}
                        </h1>

                        {meal.description && (
                            <p className="mt-3 leading-7 text-gray-500">
                                {meal.description}
                            </p>
                        )}

                        <div
                            className="mt-4 text-xl font-extrabold"
                            style={{
                                color: primaryColor,
                            }}
                        >
                            {formatPrice(
                                Number(meal.price)
                            )}
                        </div>

                        {meal.options.length > 0 && (
                            <div className="mt-7">
                                <h2 className="text-base font-extrabold text-gray-950">
                                    الإضافات
                                </h2>

                                <div className="mt-3 space-y-2">
                                    {meal.options.map(
                                        (option) => {
                                            const selected =
                                                selectedOptions.some(
                                                    (item) =>
                                                        item.name ===
                                                            option.name &&
                                                        Number(
                                                            item.price
                                                        ) ===
                                                            Number(
                                                                option.price
                                                            )
                                                );

                                            return (
                                                <button
                                                    key={`${option.name}-${option.price}`}
                                                    type="button"
                                                    onClick={() =>
                                                        toggleOption(
                                                            option
                                                        )
                                                    }
                                                    disabled={
                                                        !meal.isAvailable
                                                    }
                                                    className={`flex w-full items-center justify-between rounded-2xl border p-4 text-right transition ${
                                                        selected
                                                            ? "border-[#B42318] bg-[#B42318]/5"
                                                            : "border-gray-200 bg-white"
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                                                                selected
                                                                    ? "border-[#B42318] bg-[#B42318]"
                                                                    : "border-gray-300"
                                                            }`}
                                                        >
                                                            {selected && (
                                                                <div className="h-2 w-2 rounded-full bg-white" />
                                                            )}
                                                        </div>

                                                        <span className="font-bold text-gray-800">
                                                            {
                                                                option.name
                                                            }
                                                        </span>
                                                    </div>

                                                    <span className="font-bold text-gray-500">
                                                        +
                                                        {formatPrice(
                                                            Number(
                                                                option.price
                                                            )
                                                        )}
                                                    </span>
                                                </button>
                                            );
                                        }
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="mt-7 flex items-center justify-between rounded-2xl bg-[#FAF8F5] p-4">
                            <span className="font-bold text-gray-700">
                                الكمية
                            </span>

                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setQuantity(
                                            (current) =>
                                                Math.max(
                                                    1,
                                                    current - 1
                                                )
                                        )
                                    }
                                    disabled={
                                        !meal.isAvailable
                                    }
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700"
                                >
                                    <Minus className="h-4 w-4" />
                                </button>

                                <span className="w-6 text-center font-extrabold">
                                    {quantity}
                                </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setQuantity(
                                            (current) =>
                                                current + 1
                                        )
                                    }
                                    disabled={
                                        !meal.isAvailable
                                    }
                                    className="flex h-10 w-10 items-center justify-center rounded-full text-white"
                                    style={{
                                        backgroundColor:
                                            primaryColor,
                                    }}
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-5">
                            <div>
                                <p className="text-xs font-semibold text-gray-400">
                                    الإجمالي
                                </p>

                                <p
                                    className="mt-1 text-xl font-extrabold"
                                    style={{
                                        color: primaryColor,
                                    }}
                                >
                                    {formatPrice(
                                        totalPrice
                                    )}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleAddToCart}
                                disabled={!meal.isAvailable}
                                className="flex items-center gap-2 rounded-2xl px-5 py-3.5 font-bold shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                                style={{
                                    backgroundColor:
                                        primaryColor,
                                    color: primaryTextColor,
                                }}
                            >
                                <ShoppingBag className="h-5 w-5" />
                                إضافة إلى الطلب
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {cart.length > 0 && (
                <div className="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-3xl">
                    <button
                        type="button"
                        onClick={() =>
                            setCartOpen(true)
                        }
                        className="flex w-full items-center justify-between rounded-2xl px-5 py-4 font-bold shadow-xl"
                        style={{
                            backgroundColor:
                                primaryColor,
                            color: primaryTextColor,
                        }}
                    >
                        <div className="flex items-center gap-2">
                            <ShoppingBag className="h-5 w-5" />
                            <span>متابعة الطلب</span>
                        </div>

                        <span>
                            {formatPrice(cartTotal)}
                        </span>
                    </button>
                </div>
            )}

            {cartOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/40"
                    onClick={() =>
                        setCartOpen(false)
                    }
                >
                    <div
                        className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="mx-auto w-full max-w-3xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-extrabold text-gray-950">
                                        طلبك
                                    </h2>

                                    <p className="mt-1 text-xs font-medium text-gray-500">
                                        راجع طلبك قبل المتابعة
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setCartOpen(
                                            false
                                        )
                                    }
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="mt-6 space-y-3">
                                {cart.map(
                                    (item) => (
                                        <div
                                            key={`${item.mealId}-${(
                                                item.selectedOptions ??
                                                []
                                            )
                                                .map(
                                                    (
                                                        option
                                                    ) =>
                                                        `${option.name}-${option.price}`
                                                )
                                                .sort()
                                                .join(
                                                    "|"
                                                )}`}
                                            className="rounded-2xl bg-[#FAFAFA] p-3"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-xs font-bold text-gray-400">
                                                    وجبة
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <h3 className="truncate text-sm font-bold text-gray-950">
                                                        {
                                                            item.name
                                                        }
                                                    </h3>

                                                    <p
                                                        className="mt-1 text-sm font-bold"
                                                        style={{
                                                            color: primaryColor,
                                                        }}
                                                    >
                                                        {formatPrice(
                                                            item.price ??
                                                                0
                                                        )}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            addItem(
                                                                item
                                                            )
                                                        }
                                                        className="flex h-8 w-8 items-center justify-center rounded-full text-white"
                                                        style={{
                                                            backgroundColor:
                                                                primaryColor,
                                                        }}
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </button>

                                                    <span className="w-5 text-center text-sm font-bold">
                                                        {
                                                            item.quantity
                                                        }
                                                    </span>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            decreaseFromCart(
                                                                item.mealId,
                                                                item.selectedOptions ??
                                                                    []
                                                            )
                                                        }
                                                        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-600"
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            {item.selectedOptions &&
                                                item
                                                    .selectedOptions
                                                    .length >
                                                    0 && (
                                                    <div className="mt-3 border-t border-gray-200 pt-3">
                                                        <div className="flex flex-wrap gap-2">
                                                            {item.selectedOptions.map(
                                                                (
                                                                    option
                                                                ) => (
                                                                    <span
                                                                        key={`${option.name}-${option.price}`}
                                                                        className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-600"
                                                                    >
                                                                        {
                                                                            option.name
                                                                        }{" "}
                                                                        +
                                                                        {formatPrice(
                                                                            Number(
                                                                                option.price
                                                                            )
                                                                        )}
                                                                    </span>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                    )
                                )}
                            </div>

                            <div className="mt-6 border-t border-gray-200 pt-5">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-gray-500">
                                        المجموع
                                    </span>

                                    <span
                                        className="text-xl font-extrabold"
                                        style={{
                                            color: primaryColor,
                                        }}
                                    >
                                        {formatPrice(
                                            cartTotal
                                        )}
                                    </span>
                                </div>

                                <Link
                                    href={`/r/${slug}/checkout?slug=${slug}`}
                                    onClick={() =>
                                        setCartOpen(
                                            false
                                        )
                                    }
                                    className="mt-5 flex w-full items-center justify-center rounded-2xl py-3.5 text-lg font-bold shadow-md"
                                    style={{
                                        backgroundColor:
                                            primaryColor,
                                        color: primaryTextColor,
                                    }}
                                >
                                    متابعة الطلب
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}