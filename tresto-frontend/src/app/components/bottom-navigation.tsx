"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    UtensilsCrossed,
    Building2,
    Users,
} from "lucide-react";

const navigationItems = [
    {
        label: "الرئيسية",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "الوجبات",
        href: "/dashboard/meals",
        icon: UtensilsCrossed,
    },
    {
        label: "الفروع",
        href: "/dashboard/branches",
        icon: Building2,
    },
    {
        label: "الموظفون",
        href: "/dashboard/employees",
        icon: Users,
    },
];

export default function BottomNavigation() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 z-50 w-full border-t border-gray-200 bg-white">
            <div className="mx-auto flex h-16 max-w-3xl items-center justify-around">
                {navigationItems.map((item) => {
                    const Icon = item.icon;

                    const isActive =
                        item.href === "/dashboard"
                            ? pathname === item.href
                            : pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex h-full flex-1 flex-col items-center justify-center gap-1 transition-colors ${
                                isActive
                                    ? "text-primary"
                                    : "text-gray-500 hover:text-gray-900"
                            }`}
                        >
                            <Icon
                                size={22}
                                strokeWidth={isActive ? 2.5 : 2}
                            />

                            <span className="text-xs">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}