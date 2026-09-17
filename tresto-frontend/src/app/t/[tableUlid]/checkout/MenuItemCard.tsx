"use client";

import { Plus } from "lucide-react";

export type Meal = {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    badge?: string;
};

type Props = {
    meal: Meal;
    onAddToCart: (meal: Meal) => void;
};

export function MenuItemCard({ meal, onAddToCart }: Props) {
    return (
        <div className="bg-card text-card-foreground rounded-2xl border shadow-sm overflow-hidden flex flex-col justify-between">
            <div className="relative h-44 w-full bg-muted">
                <img
                    src={meal.image}
                    alt={meal.name}
                    className="w-full h-full object-cover"
                />
                {meal.badge && (
                    <span className="absolute top-3 right-3 bg-white/90 text-primary font-bold text-[10px] px-2.5 py-1 rounded-full shadow-sm backdrop-blur-sm">
                        {meal.badge}
                    </span>
                )}
            </div>

            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="font-bold text-sm text-foreground mb-1">{meal.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {meal.description}
                    </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                    <span className="font-bold text-primary text-sm">
                        {meal.price} <span className="text-[10px] font-normal">ر.س</span>
                    </span>

                    <button
                        type="button"
                        onClick={() => onAddToCart(meal)}
                        className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}