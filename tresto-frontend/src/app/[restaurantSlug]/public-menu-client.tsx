"use client";

import { useEffect, useMemo, useState } from "react";

import { getCategoriesAction } from "../dashboard/meals/categories-actions";
import { getMealsAction } from "../dashboard/meals/actions";
import getDataAction from "./get-data-action";

import {
    Search,
    Plus,
    Minus,
    ShoppingCart,
    X,
    Flame,
} from "lucide-react";

type Restaurant = {
    id: string;
    name: string;
    slug: string;
    status: string;
    created_at: string;
    updated_at: string;
};

type RestaurantSettings = {
    id: string;
    restaurant_id: string;
    primary_color: string;
    secondary_color: string | null;
    logo_url: string | null;
    title: string | null;
    subtitle: string | null;
    hero_image_url: string | null;
    created_at: string;
    updated_at: string;
};

export type RestaurantResponse = {
    restaurant: Restaurant;
    restaurant_settings: RestaurantSettings;
};

type Category = {
    id: string;
    name: string;
};

type Meal = {
    id: string;
    category_id: string;
    name: string;
    description: string | null;
    price: number;
    image_url: string | null;
    is_available: boolean;
    is_popular?: boolean;
};

type CartItem = {
    meal: Meal;
    quantity: number;
};

type Props = {
    data: RestaurantResponse;
    slug: string
};

/* =========================================================
   Helpers
========================================================= */

function formatPrice(price: number) {
    return `${price.toLocaleString("ar-IQ")} د.ع`;
}

function getContrastTextColor(hex: string) {
    const normalized = hex.replace("#", "");

    if (!/^[0-9A-Fa-f]{6}$/.test(normalized)) {
        return "#FFFFFF";
    }

    const rgb = [0, 1, 2].map(
        (index) =>
            parseInt(
                normalized.slice(index * 2, index * 2 + 2),
                16
            ) / 255
    );

    const [r, g, b] = rgb.map((value) =>
        value <= 0.03928
            ? value / 12.92
            : Math.pow((value + 0.055) / 1.055, 2.4)
    );

    const luminance =
        0.2126 * r +
        0.7152 * g +
        0.0722 * b;

    const contrastWhite =
        1.05 / (luminance + 0.05);

    const contrastBlack =
        (luminance + 0.05) / 0.05;

    return contrastWhite >= contrastBlack
        ? "#FFFFFF"
        : "#111827";
}

/* =========================================================
   Component
========================================================= */

export default function PublicMenuClient({
    data,
    slug
}: Props) {
    const {
        restaurant,
        restaurant_settings: settings,
    } = data;

    const primaryColor =
        settings.primary_color || "#B42318";

    const secondaryColor =
        settings.secondary_color || "#FFFFFF";

    const primaryTextColor =
        getContrastTextColor(primaryColor);

    const logoUrl = settings.logo_url;

    const restaurantTitle =
        settings.title || restaurant.name;

    const restaurantSubtitle =
        settings.subtitle;

    /* =====================================================
       Data
    ===================================================== */

    const [meals, setMeals] = useState<Meal[]>([]);
    const [categories, setCategories] = useState<Category[]>(
        []
    );

    const [loadingMeals, setLoadingMeals] =
        useState(true);

    const [loadingCategories, setLoadingCategories] =
        useState(true);

    useEffect(() => {
        async function getData() {
            try {
                const {meals, categories} =
                    await getDataAction(slug);

                /*
                 * Supports both:
                 *
                 * Meal[]
                 *
                 * and:
                 *
                 * { data: Meal[] }
                 */

                const mealsData = Array.isArray(
                    meals
                )
                    ? meals
                    : meals?.data ?? [];

                const categoriesData = Array.isArray(
                    categories
                )
                    ? categories
                    : categories?.data ?? [];

                setMeals(mealsData);
                setCategories(categoriesData);
            } catch (error) {
                console.error(
                    "Failed to load menu data:",
                    error
                );

                setMeals([]);
                setCategories([]);
            } finally {
                setLoadingMeals(false);
                setLoadingCategories(false);
            }
        }

        getData();
    }, [slug]);

    /* =====================================================
       Filters
    ===================================================== */

    const [selectedCategory, setSelectedCategory] =
        useState("all");

    const [search, setSearch] = useState("");

    const [cart, setCart] = useState<CartItem[]>([]);

    const [cartOpen, setCartOpen] = useState(false);

    /* =====================================================
       Filter Meals
    ===================================================== */

    const filteredMeals = useMemo(() => {
        const normalizedSearch = search
            .trim()
            .toLowerCase();

        return meals.filter((meal) => {
            const matchesCategory =
                selectedCategory === "all" ||
                meal.category_id === selectedCategory;

            if (!normalizedSearch) {
                return matchesCategory;
            }

            const matchesSearch =
                meal.name
                    .toLowerCase()
                    .includes(normalizedSearch) ||
                meal.description
                    ?.toLowerCase()
                    .includes(normalizedSearch);

            return matchesCategory && matchesSearch;
        });
    }, [meals, selectedCategory, search]);

    /* =====================================================
       Cart
    ===================================================== */

    const cartCount = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const cartTotal = cart.reduce(
        (total, item) =>
            total + item.meal.price * item.quantity,
        0
    );

    function addToCart(meal: Meal) {
        setCart((current) => {
            const existing = current.find(
                (item) => item.meal.id === meal.id
            );

            if (existing) {
                return current.map((item) =>
                    item.meal.id === meal.id
                        ? {
                              ...item,
                              quantity:
                                  item.quantity + 1,
                          }
                        : item
                );
            }

            return [
                ...current,
                {
                    meal,
                    quantity: 1,
                },
            ];
        });
    }

    function decreaseFromCart(mealId: string) {
        setCart((current) => {
            const existing = current.find(
                (item) => item.meal.id === mealId
            );

            if (!existing) {
                return current;
            }

            if (existing.quantity === 1) {
                return current.filter(
                    (item) => item.meal.id !== mealId
                );
            }

            return current.map((item) =>
                item.meal.id === mealId
                    ? {
                          ...item,
                          quantity:
                              item.quantity - 1,
                      }
                    : item
            );
        });
    }

    function getMealQuantity(mealId: string) {
        return (
            cart.find(
                (item) => item.meal.id === mealId
            )?.quantity ?? 0
        );
    }

    /* =====================================================
       Render
    ===================================================== */

    return (
        <main
            dir="rtl"
            className="min-h-screen bg-[#FAFAFA] pb-28"
            style={
                {
                    "--primary": primaryColor,
                    "--secondary": secondaryColor,
                } as React.CSSProperties
            }
        >
            {/* Header */}

            <header
                className="sticky top-0 z-30 border-b border-gray-200/70 bg-white/95 backdrop-blur"
                dir="ltr"
            >
                <div className="mx-auto flex h-16 max-w-3xl items-center px-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
                            {logoUrl ? (
                                <img
                                    src={logoUrl}
                                    alt={restaurant.name}
                                    className="h-full w-full object-contain"
                                />
                            ) : (
                                <span
                                    className="text-lg font-bold"
                                    style={{
                                        color: primaryColor,
                                    }}
                                >
                                    {restaurant.name
                                        .charAt(0)
                                        .toUpperCase()}
                                </span>
                            )}
                        </div>

                        <h1
                            className="text-xl font-bold"
                            style={{
                                color: primaryColor,
                            }}
                        >
                            {restaurant.name}
                        </h1>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-3xl px-4">
                {/* Hero */}

                <section
                    className="overflow-hidden rounded-b-[2rem] px-6 py-10 text-center shadow-sm"
                    style={{
                        backgroundColor: primaryColor,
                    }}
                >
                    <div className="mx-auto flex max-w-xl flex-col items-center">
                        {logoUrl && (
                            <div className="mb-5 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-md">
                                <img
                                    src={logoUrl}
                                    alt={restaurant.name}
                                    className="h-full w-full object-contain p-2"
                                />
                            </div>
                        )}

                        <h2
                            className="text-3xl font-extrabold tracking-tight"
                            style={{
                                color: primaryTextColor,
                            }}
                        >
                            {restaurantTitle}
                        </h2>

                        {restaurantSubtitle && (
                            <p
                                className="mt-2 text-sm font-medium"
                                style={{
                                    color: primaryTextColor,
                                    opacity: 0.85,
                                }}
                            >
                                {restaurantSubtitle}
                            </p>
                        )}
                    </div>
                </section>

                {/* Search */}

                <section className="mt-7">
                    <div className="relative">
                        <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                        <input
                            type="search"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="ابحث عن وجبتك المفضلة..."
                            className="h-12 w-full rounded-full border border-gray-200 bg-white pr-12 pl-4 text-sm font-medium text-gray-800 shadow-sm outline-none transition placeholder:text-gray-400"
                            style={{
                                borderColor: search
                                    ? primaryColor
                                    : undefined,
                            }}
                        />
                    </div>
                </section>

                {/* Categories */}

                <section className="mt-4">
                    <div className="flex gap-3 overflow-x-auto pb-2">
                        {/* All */}

                        <button
                            type="button"
                            onClick={() =>
                                setSelectedCategory("all")
                            }
                            className="shrink-0 rounded-full border px-5 py-2.5 text-sm font-semibold transition"
                            style={
                                selectedCategory ===
                                "all"
                                    ? {
                                          backgroundColor:
                                              primaryColor,
                                          borderColor:
                                              primaryColor,
                                          color: primaryTextColor,
                                      }
                                    : {
                                          backgroundColor:
                                              "#FFFFFF",
                                          borderColor:
                                              `${primaryColor}35`,
                                          color: "#4B5563",
                                      }
                            }
                        >
                            الكل
                        </button>

                        {!loadingCategories &&
                            categories.map(
                                (category) => {
                                    const active =
                                        selectedCategory ===
                                        category.id;

                                    return (
                                        <button
                                            key={
                                                category.id
                                            }
                                            type="button"
                                            onClick={() =>
                                                setSelectedCategory(
                                                    category.id
                                                )
                                            }
                                            className="shrink-0 rounded-full border px-5 py-2.5 text-sm font-semibold transition"
                                            style={
                                                active
                                                    ? {
                                                          backgroundColor:
                                                              primaryColor,
                                                          borderColor:
                                                              primaryColor,
                                                          color: primaryTextColor,
                                                      }
                                                    : {
                                                          backgroundColor:
                                                              "#FFFFFF",
                                                          borderColor:
                                                              `${primaryColor}35`,
                                                          color: "#4B5563",
                                                      }
                                            }
                                        >
                                            {
                                                category.name
                                            }
                                        </button>
                                    );
                                }
                            )}
                    </div>
                </section>

                {/* Meals */}

                <section className="mt-7">
                    <div className="mb-4 flex items-end justify-between">
                        <div>
                            <h2 className="text-xl font-extrabold text-gray-950">
                                القائمة
                            </h2>

                            <p className="mt-1 text-xs font-medium text-gray-500">
                                اختر ما يناسبك
                            </p>
                        </div>

                        {!loadingMeals && (
                            <span className="text-xs font-semibold text-gray-400">
                                {filteredMeals.length} وجبة
                            </span>
                        )}
                    </div>

                    {loadingMeals ? (
                        <div className="space-y-5">
                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="h-52 animate-pulse rounded-2xl border border-gray-200 bg-white"
                                />
                            ))}
                        </div>
                    ) : filteredMeals.length === 0 ? (
                        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
                            <div
                                className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
                                style={{
                                    backgroundColor:
                                        `${primaryColor}12`,
                                }}
                            >
                                <Search
                                    className="h-6 w-6"
                                    style={{
                                        color: primaryColor,
                                    }}
                                />
                            </div>

                            <h3 className="mt-4 text-base font-bold text-gray-900">
                                لم نجد ما تبحث عنه
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                جرب البحث باسم وجبة أخرى.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {filteredMeals.map(
                                (meal) => {
                                    const quantity =
                                        getMealQuantity(
                                            meal.id
                                        );

                                    return (
                                        <article
                                            key={meal.id}
                                            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                                        >
                                            {/* Image */}

                                            {meal.image_url && (
                                                <div className="relative aspect-[1.8/1] overflow-hidden bg-gray-100">
                                                    <img
                                                        src={
                                                            meal.image_url
                                                        }
                                                        alt={
                                                            meal.name
                                                        }
                                                        className="h-full w-full object-cover"
                                                    />

                                                    {meal.is_popular && (
                                                        <div
                                                            className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-bold shadow-sm"
                                                            style={{
                                                                color: primaryColor,
                                                            }}
                                                        >
                                                            <Flame className="h-3.5 w-3.5" />
                                                            الأكثر طلباً
                                                        </div>
                                                    )}

                                                    {!meal.is_available && (
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/45">
                                                            <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-gray-800">
                                                                غير متوفر حالياً
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Content */}

                                            <div className="p-4">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="min-w-0">
                                                        <h3 className="text-base font-extrabold text-gray-950">
                                                            {
                                                                meal.name
                                                            }
                                                        </h3>

                                                        {meal.description && (
                                                            <p className="mt-2 text-sm font-medium leading-6 text-gray-500">
                                                                {
                                                                    meal.description
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    <span
                                                        className="shrink-0 text-base font-extrabold"
                                                        style={{
                                                            color: primaryColor,
                                                        }}
                                                    >
                                                        {formatPrice(
                                                            meal.price
                                                        )}
                                                    </span>
                                                </div>

                                                <div className="mt-4 flex items-center justify-between">
                                                    <span className="text-xs font-semibold text-gray-400">
                                                        {meal.is_available
                                                            ? "متوفر الآن"
                                                            : "غير متوفر"}
                                                    </span>

                                                    {meal.is_available &&
                                                        (quantity ===
                                                        0 ? (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    addToCart(
                                                                        meal
                                                                    )
                                                                }
                                                                className="flex h-11 w-11 items-center justify-center rounded-full text-white shadow-sm transition active:scale-95"
                                                                style={{
                                                                    backgroundColor:
                                                                        primaryColor,
                                                                }}
                                                            >
                                                                <Plus className="h-5 w-5" />
                                                            </button>
                                                        ) : (
                                                            <div
                                                                className="flex items-center gap-3 rounded-full border px-2 py-1"
                                                                style={{
                                                                    borderColor:
                                                                        `${primaryColor}35`,
                                                                }}
                                                            >
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        addToCart(
                                                                            meal
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

                                                                <span className="min-w-5 text-center text-sm font-bold">
                                                                    {
                                                                        quantity
                                                                    }
                                                                </span>

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        decreaseFromCart(
                                                                            meal.id
                                                                        )
                                                                    }
                                                                    className="flex h-8 w-8 items-center justify-center rounded-full border text-gray-600"
                                                                    style={{
                                                                        borderColor:
                                                                            `${primaryColor}35`,
                                                                    }}
                                                                >
                                                                    <Minus className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        </article>
                                    );
                                }
                            )}
                        </div>
                    )}
                </section>
            </div>

            {/* Cart Bar */}

            {cartCount > 0 && (
                <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4">
                    <div className="mx-auto max-w-3xl">
                        <button
                            type="button"
                            onClick={() =>
                                setCartOpen(true)
                            }
                            className="flex h-14 w-full items-center justify-between rounded-full px-5 text-white shadow-xl"
                            style={{
                                backgroundColor:
                                    primaryColor,
                            }}
                        >
                            <div className="flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5" />

                                <span className="text-sm font-bold">
                                    عرض الطلب
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
                                    {cartCount} عناصر
                                </span>

                                <span className="text-sm font-extrabold">
                                    {formatPrice(
                                        cartTotal
                                    )}
                                </span>
                            </div>
                        </button>
                    </div>
                </div>
            )}

            {/* Cart */}

            {cartOpen && (
                <div className="fixed inset-0 z-50">
                    <button
                        type="button"
                        aria-label="إغلاق"
                        onClick={() =>
                            setCartOpen(false)
                        }
                        className="absolute inset-0 bg-black/40"
                    />

                    <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl">
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
                                {cart.map((item) => (
                                    <div
                                        key={
                                            item.meal.id
                                        }
                                        className="flex items-center gap-3 rounded-2xl bg-[#FAFAFA] p-3"
                                    >
                                        {item.meal.image_url && (
                                            <img
                                                src={
                                                    item.meal
                                                        .image_url
                                                }
                                                alt={
                                                    item.meal
                                                        .name
                                                }
                                                className="h-16 w-16 rounded-xl object-cover"
                                            />
                                        )}

                                        <div className="min-w-0 flex-1">
                                            <h3 className="truncate text-sm font-bold text-gray-950">
                                                {
                                                    item.meal
                                                        .name
                                                }
                                            </h3>

                                            <p
                                                className="mt-1 text-sm font-bold"
                                                style={{
                                                    color: primaryColor,
                                                }}
                                            >
                                                {formatPrice(
                                                    item
                                                        .meal
                                                        .price
                                                )}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    addToCart(
                                                        item.meal
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
                                                        item
                                                            .meal
                                                            .id
                                                    )
                                                }
                                                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-600"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
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

                                <button
                                    type="button"
                                    className="mt-5 w-full rounded-full py-3.5 text-sm font-bold shadow-md"
                                    style={{
                                        backgroundColor:
                                            primaryColor,
                                        color: primaryTextColor,
                                    }}
                                >
                                    متابعة الطلب
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}