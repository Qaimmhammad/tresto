"use client";

import { Menu } from "lucide-react";

type Props = {
    restaurantName?: string;
    subTitle?: string;
};

export function MenuHeader({ 
    restaurantName,
    subTitle 
}: Props) {
    return (
        <header className="w-full bg-background border-b pb-4">
            <div className="flex items-center justify-between p-4">
                <button 
                    type="button" 
                    className="p-2 text-foreground hover:bg-accent rounded-lg transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <div className="text-right">
                    <span className="text-xl font-bold text-primary block leading-tight">
                        {restaurantName}
                    </span>
                </div>
            </div>

            <div className="mx-4 mt-2 p-6 bg-primary text-primary-foreground rounded-2xl text-center space-y-1 shadow-sm">
                <h1 className="text-2xl font-black">{restaurantName}</h1>
                <p className="text-xs text-primary-foreground/90 font-medium">{subTitle}</p>
            </div>
        </header>
    );
}