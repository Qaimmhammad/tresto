import type { ReactNode } from "react";
import BottomNavigation from "../components/bottom-navigation";
import { getCurrentUser } from "@/app/api/auth/user";
import { redirect } from "next/navigation";
import Header from "../components/header";

type DashboardLayoutProps = {
    children: ReactNode;
};

export default async function DashboardLayout({
    children,
}: DashboardLayoutProps) {
    const user = await getCurrentUser();
    if (!user){
        redirect("/login");
    }
    return (
        <div className="min-h-screen">
            <Header></Header>
            <main className="pb-20">
                {children}
            </main>

            <BottomNavigation />
        </div>
    );
}