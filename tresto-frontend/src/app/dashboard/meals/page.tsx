"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {getMealsAction} from "./actions";

import {
    Plus,
    Search,
    Pencil,
    Trash2,
    Utensils,
} from "lucide-react";
import type Meal from "@/models/meal-model";
import type Category from "@/models/category-model";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { createCategoryAction, getCategoriesAction } from "./categories-actions";
import { getMeal } from "@/api/meals/meals";



export default function MealsPage() {
    const router = useRouter();
    const [meals, setMeals] = useState<Meal[]>();

    // 1. Add state to store categories safely
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);

    const [search, setSearch] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const [categoryName, setCategoryName] = useState("");

    // 2. Fetch categories asynchronously inside useEffect on component mount
    useEffect(() => {
        async function fetchCategories() {
            try {
                const data = await getCategoriesAction();
                setCategories(data);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            } finally {
                setIsLoadingCategories(false);
            }
        }

        fetchCategories();

        async function getMeals() {
            const data = await getMealsAction();
            setMeals(data);
        }
        getMeals();

    }, []);

    const filteredMeals = useMemo(() => {
        return meals?.filter((meal) => {
            const matchesSearch = meal.name
                .toLowerCase()
                .includes(search.toLowerCase());

            const matchesCategory =
                selectedCategoryId === null ||
                meal.categoryId === selectedCategoryId;

            return matchesSearch && matchesCategory;
        });
    }, [meals, search, selectedCategoryId]);

    async function handleCreateCategory(
        event: React.FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        if (!categoryName.trim()) {
            return;
        }

        await createCategoryAction({ name: categoryName });

        // Refresh categories after creating a new one
        const updatedCategories = await getCategoriesAction();
        setCategories(updatedCategories);

        setCategoryName("");
        setIsCategoryDialogOpen(false);
    }

    function handleEditMeal(meal: Meal) { }

    function handleDeleteMeal(mealId: string) { }

    function handleAddMeal() {
        router.push("/dashboard/meals/add-meal");
    }

    return (
        <>
        <main className="min-h-screen pb-28" dir="rtl">
            <div className="mx-auto w-full max-w-5xl px-4 py-6">
                <header className="mb-6">
                    <h1 className="text-2xl font-bold">الوجبات</h1>
                </header>

                <div className="relative mb-6">
                    <Search
                        size={20}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="البحث عن وجبة..."
                        className="h-12 w-full rounded-xl border bg-background pl-12 pr-4 outline-none transition focus:border-primary"
                    />
                </div>

                <section className="mb-8">
                    <h2 className="mb-3 font-semibold">الفئات</h2>

                    <div className="flex gap-3 overflow-x-auto pb-2">
                        <button
                            type="button"
                            onClick={() => setIsCategoryDialogOpen(true)}
                            className="flex h-10 shrink-0 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground"
                        >
                            <Plus size={16} />
                            إضافة فئة
                        </button>

                        <button
                            type="button"
                            onClick={() => setSelectedCategoryId(null)}
                            className={`h-10 shrink-0 rounded-lg border px-4 text-sm font-medium ${selectedCategoryId === null
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "bg-background"
                                }`}
                        >
                            الكل
                        </button>

                        {isLoadingCategories ? (
                            <span className="text-sm text-muted-foreground self-center">
                                جاري التحميل...
                            </span>
                        ) : (
                            categories.map((category) => (
                                <button
                                    key={category.id}
                                    type="button"
                                    onClick={() => setSelectedCategoryId(category.id)}
                                    className={`h-10 shrink-0 rounded-lg border px-4 text-sm font-medium ${selectedCategoryId === category.id
                                            ? "border-primary bg-primary text-primary-foreground"
                                            : "bg-background"
                                        }`}
                                >
                                    {category.name}
                                </button>
                            ))
                        )}
                    </div>
                </section>

                <section>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="font-semibold">الوجبات</h2>
                        <span className="text-sm text-muted-foreground">
                            {filteredMeals?.length} وجبات
                        </span>
                    </div>

                {filteredMeals?.length === 0 || !filteredMeals ? (
                        <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed">
                            <Utensils
                                size={40}
                                className="mb-3 text-muted-foreground"
                            />
                            <h3 className="font-semibold">لم يتم العثور على وجبات</h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                أضف وجبة أو قم بتغيير البحث.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredMeals?.map((meal) => (
                                <article
                                    key={meal.id}
                                    className="flex items-center gap-4 rounded-xl border bg-card p-4"
                                >
                                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                                        {meal.imageUrl ? (
                                            <img
                                                src={meal.imageUrl}
                                                alt={meal.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <Utensils
                                                size={28}
                                                className="text-muted-foreground"
                                            />
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                <h3 className="truncate font-semibold">
                                                    {meal.name}
                                                </h3>
                                                {meal.description && (
                                                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                                                        {meal.description}
                                                    </p>
                                                )}
                                            </div>

                                            <span className="shrink-0 font-semibold" dir="ltr">
                                                {meal.price} IQD
                                            </span>
                                        </div>

                                        <div className="mt-3 flex items-center justify-between">
                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-medium ${meal.isAvailable
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {meal.isAvailable ? "متوفر" : "غير متوفر"}
                                            </span>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => { }}
                                                    className="flex h-9 w-9 items-center justify-center rounded-lg border"
                                                >
                                                    <Pencil size={17} />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteMeal(meal.id)}
                                                    className="flex h-9 w-9 items-center justify-center rounded-lg border"
                                                >
                                                    <Trash2 size={17} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            <div className="fixed bottom-0 left-0 right-0 border-t bg-background/95 p-4 backdrop-blur">
                <div className="mx-auto flex w-full max-w-5xl justify-end">
                    <button
                        type="button"
                        onClick={handleAddMeal}
                        className="flex h-12 items-center gap-2 rounded-xl bg-primary px-6 font-semibold text-primary-foreground"
                    >
                        <Plus size={20} />
                        إضافة وجبة
                    </button>
                </div>
            </div>

            <Dialog
                open={isCategoryDialogOpen}
                onOpenChange={setIsCategoryDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>إضافة فئة جديدة</DialogTitle>
                        <DialogDescription>
                            أنشئ فئة جديدة لوجبات مطعمك.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCreateCategory} className="space-y-4">
                        <input
                            type="text"
                            value={categoryName}
                            onChange={(event) => setCategoryName(event.target.value)}
                            placeholder="اسم الفئة"
                            className="h-11 w-full rounded-lg border bg-background px-3 outline-none focus:border-primary"
                            autoFocus
                        />

                        <button
                            type="submit"
                            className="h-11 w-full rounded-lg bg-primary font-medium text-primary-foreground"
                        >
                            إنشاء فئة
                        </button>
                    </form>
                </DialogContent>
            </Dialog>
        </main>
        <div className="fixed bottom-14 right-0 border-t bg-background/95 p-4 backdrop-blur">
                <div className="mx-auto flex w-full max-w-5xl justify-end">
                    <button
                        type="button"
                        onClick={handleAddMeal}
                        className="flex h-12 items-center gap-2 rounded-xl bg-primary px-6 font-semibold text-primary-foreground"
                        dir="rtl"
                    >
                        <Plus size={20} />
                        إضافة وجبة
                    </button>
                </div>
            </div>
        </>
    );
}