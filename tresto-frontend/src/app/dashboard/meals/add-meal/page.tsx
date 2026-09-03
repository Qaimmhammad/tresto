"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowRight,
    ImagePlus,
    Loader2,
    Plus,
    Trash2,
    Utensils,
    X,
} from "lucide-react";

import type Category from "@/models/category-model";
import { createMealAction, uploadMealImageAction } from "../actions";
import { getCategoriesAction } from "../categories-actions";


import { uploadMealImage } from "@/helpers/upload-image";

type MealOption = {
    key: string;
    value: string;
};

export default function AddMealPage() {
    const router = useRouter();

    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState("");

    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [options, setOptions] = useState<MealOption[]>([
        {
            key: "",
            value: "",
        },
    ]);

    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const data = await getCategoriesAction();
                setCategories(data);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
                setError("فشل تحميل الفئات.");
            } finally {
                setIsLoadingCategories(false);
            }
        }

        fetchCategories();
    }, []);

    function handleImageChange(
        event: React.ChangeEvent<HTMLInputElement>,
    ) {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            setError("يرجى اختيار ملف صورة صالح.");
            return;
        }

        setError("");
        setImage(file);

        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }

        setImagePreview(URL.createObjectURL(file));
    }

    function removeImage() {
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }

        setImage(null);
        setImagePreview(null);
    }

    function addOption() {
        setOptions((currentOptions) => [
            ...currentOptions,
            {
                key: "",
                value: "",
            },
        ]);
    }

    function updateOption(
        index: number,
        field: "key" | "value",
        value: string,
    ) {
        setOptions((currentOptions) =>
            currentOptions.map((option, optionIndex) =>
                optionIndex === index
                    ? {
                        ...option,
                        [field]: value,
                    }
                    : option,
            ),
        );
    }

    function removeOption(index: number) {
        setOptions((currentOptions) =>
            currentOptions.filter(
                (_, optionIndex) => optionIndex !== index,
            ),
        );
    }

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        setError("");

        if (!name.trim()) {
            setError("اسم الوجبة مطلوب.");
            return;
        }

        if (!price.trim()) {
            setError("سعر الوجبة مطلوب.");
            return;
        }

        const parsedPrice = Number(price);

        if (!Number.isInteger(parsedPrice) || parsedPrice < 0) {
            setError("يجب أن يكون السعر رقمًا صحيحًا.");
            return;
        }

        if (!description.trim()) {
            setError("وصف الوجبة مطلوب.");
            return;
        }

        if (!categoryId) {
            setError("يرجى اختيار فئة للوجبة.");
            return;
        }

        const validOptions = options.filter(
            (option) =>
                option.key.trim() !== "" &&
                option.value.trim() !== "",
        );

        setIsSubmitting(true);

        try {
            let imageUrl: string | null = null;

            if (image) {
                imageUrl = await uploadMealImageAction(image);
            }

            const formattedOptions =
                validOptions.length > 0
                    ? validOptions.map((option) => ({
                        name: option.key.trim(),
                        price: option.value.trim(),
                    }))
                    : null;

            await createMealAction({
                name: name.trim(),
                price: parsedPrice,
                description: description.trim(),
                imageUrl: imageUrl,
                categoryId: categoryId,
                options: formattedOptions,
            });

            router.push("/dashboard/meals");
            router.refresh();
        } catch (error) {
            console.error("Failed to create meal:", error);

            setError(
                error instanceof Error
                    ? error.message
                    : "حدث خطأ أثناء إنشاء الوجبة.",
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="min-h-screen pb-28" dir="rtl">
            <div className="mx-auto w-full max-w-3xl px-4 py-6">
                <header className="mb-8">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="mb-5 flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
                    >
                        <ArrowRight size={18} />
                        العودة إلى الوجبات
                    </button>

                    <h1 className="text-2xl font-bold">
                        إضافة وجبة جديدة
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        أضف وجبة جديدة إلى قائمة مطعمك.
                    </p>
                </header>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    {/* Image */}
                    <section className="rounded-2xl border bg-card p-5">
                        <div className="mb-4">
                            <h2 className="font-semibold">صورة الوجبة</h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                اختيارية
                            </p>
                        </div>

                        {imagePreview ? (
                            <div className="relative overflow-hidden rounded-xl border">
                                <img
                                    src={imagePreview}
                                    alt="معاينة الوجبة"
                                    className="h-64 w-full object-cover"
                                />

                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-background/90 shadow-sm backdrop-blur"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        ) : (
                            <label className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed transition hover:border-primary hover:bg-primary/5">
                                <ImagePlus
                                    size={36}
                                    className="mb-3 text-primary"
                                />

                                <span className="font-medium">
                                    اختر صورة للوجبة
                                </span>

                                <span className="mt-1 text-sm text-muted-foreground">
                                    اضغط لاختيار صورة من جهازك
                                </span>

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </section>

                    {/* Basic information */}
                    <section className="rounded-2xl border bg-card p-5">
                        <div className="mb-5">
                            <h2 className="font-semibold">
                                معلومات الوجبة
                            </h2>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    اسم الوجبة
                                </label>

                                <input
                                    type="text"
                                    value={name}
                                    onChange={(event) =>
                                        setName(event.target.value)
                                    }
                                    placeholder="مثال: برغر كلاسيكي"
                                    className="h-12 w-full rounded-xl border bg-background px-4 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    السعر
                                </label>

                                <div className="relative">
                                    <input
                                        type="number"
                                        min="0"
                                        step="1"
                                        inputMode="numeric"
                                        value={price}
                                        onChange={(event) =>
                                            setPrice(event.target.value)
                                        }
                                        placeholder="0"
                                        className="h-12 w-full rounded-xl border bg-background px-4 pl-16 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        dir="ltr"
                                    />

                                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                        IQD
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    الوصف
                                </label>

                                <textarea
                                    value={description}
                                    onChange={(event) =>
                                        setDescription(event.target.value)
                                    }
                                    placeholder="اكتب وصفًا للوجبة..."
                                    rows={5}
                                    className="w-full resize-none rounded-xl border bg-background px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    الفئة
                                </label>

                                <select
                                    value={categoryId}
                                    onChange={(event) =>
                                        setCategoryId(event.target.value)
                                    }
                                    disabled={isLoadingCategories}
                                    className="h-12 w-full rounded-xl border bg-background px-4 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">
                                        {isLoadingCategories
                                            ? "جاري تحميل الفئات..."
                                            : "اختر فئة"}
                                    </option>

                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Options */}
                    <section className="rounded-2xl border bg-card p-5">
                        <div className="mb-5 flex items-start justify-between gap-4">
                            <div>
                                <h2 className="font-semibold">
                                    خيارات الوجبة
                                </h2>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    اختيارية، مثل الحجم أو نوع الإضافة.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={addOption}
                                className="flex h-10 shrink-0 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                            >
                                <Plus size={17} />
                                إضافة
                            </button>
                        </div>

                        <div className="space-y-3">
                            {options.map((option, index) => (
                                <div
                                    key={index}
                                    className="flex gap-2"
                                >
                                    <input
                                        type="text"
                                        value={option.key}
                                        onChange={(event) =>
                                            updateOption(
                                                index,
                                                "key",
                                                event.target.value,
                                            )
                                        }
                                        placeholder="اسم الخيار"
                                        className="h-11 min-w-0 flex-1 rounded-xl border bg-background px-3 outline-none focus:border-primary"
                                    />

                                    <input
                                        type="text"
                                        value={option.value}
                                        onChange={(event) =>
                                            updateOption(
                                                index,
                                                "value",
                                                event.target.value,
                                            )
                                        }
                                        placeholder="القيمة"
                                        className="h-11 min-w-0 flex-1 rounded-xl border bg-background px-3 outline-none focus:border-primary"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeOption(index)
                                        }
                                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-destructive transition hover:bg-destructive/10"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Error */}
                    {error && (
                        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="fixed bottom-18 right-4 z-50 flex h-12 items-center gap-2 rounded-xl bg-primary px-6 font-semibold text-primary-foreground shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2
                                    size={20}
                                    className="animate-spin"
                                />
                                جاري الحفظ...
                            </>
                        ) : (
                            <>
                                <Utensils size={20} />
                                إنشاء الوجبة
                            </>
                        )}
                    </button>
                </form>
            </div>
        </main>
    );
}