"use client";

import { Search } from "lucide-react";

type Category = {
    id: string;
    name: string;
};

type Props = {
    categories: Category[];
    activeCategory: string;
    onSelectCategory: (id: string) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
};

export function MenuSearchAndCategories({
    categories,
    activeCategory,
    onSelectCategory,
    searchQuery,
    onSearchChange,
}: Props) {
    return (
        <div className="space-y-4 px-4 pt-2">
            <div className="relative">
                <input
                    type="text"
                    placeholder="ابحث عن وجبتك المفضلة..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full py-3 pr-10 pl-4 text-xs bg-muted/50 border rounded-full text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Search className="w-4 h-4 text-muted-foreground absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                <button
                    type="button"
                    onClick={() => onSelectCategory("all")}
                    className={`px-5 py-2 text-xs font-semibold rounded-full whitespace-nowrap transition-colors ${
                        activeCategory === "all"
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "bg-muted/60 text-muted-foreground hover:bg-muted"
                    }`}
                >
                    الكل
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        type="button"
                        onClick={() => onSelectCategory(cat.id)}
                        className={`px-5 py-2 text-xs font-semibold rounded-full whitespace-nowrap transition-colors ${
                            activeCategory === cat.id
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "bg-muted/60 text-muted-foreground hover:bg-muted"
                        }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>
        </div>
    );
}