import { ReactNode } from "react";
import Header from "../components/header";


export default function Layout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <div
            dir="rtl"
            className="min-h-screen bg-[#FDFCFE] text-foreground font-sans"
        >
            <Header />

            <main className="flex min-h-screen flex-col items-center px-4 py-6">
                {children}
            </main>
        </div>
    );
}