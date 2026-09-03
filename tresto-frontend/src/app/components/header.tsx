"use client";
import MenuBurgerIcon from "./menu-burger-icon";
import { useState } from "react"
import { X } from "lucide-react";
import Link from "next/link";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);


    return (
        <>
            <header dir="ltr" className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-gray-100 bg-white/80 px-6 backdrop-blur-md md:px-12">

                <span className="text-2xl font-black tracking-tight text-primary md:text-4xl">
                    Tresto
                </span>

                <button
                    type="button"
                    aria-label="Open menu"
                    className="flex items-center justify-center hover:cursor-pointer"
                    onClick={() => {
                        setIsOpen(!isOpen);
                    }}
                >
                    <MenuBurgerIcon
                        strokeWidth={2}
                        color="#4B2763"
                    />
                </button>

            </header>
            <aside
                className={`fixed right-0 top-0 h-screen z-51 w-64 transition-transform bg-white ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <button
                    onClick={() => {
                        setIsOpen(false);
                    }}
                >
                    <X size={40} color="#4B2763" strokeWidth={2} className="absolute top-4 right-4 hover:cursor-pointer" />
                </button>
                <div dir="rtl" className="text-black flex text-2xl flex-col gap-6 px-6 pt-14 font-sans">
                    <Link href="/ar/about">ما هو Tresto؟</Link>

                    <Link href="/ar/pricing">الأسعار</Link>

                    <Link href="/ar/privacy">الخصوصية والسياسة</Link>

                    <Link href="/ar/terms">شروط الاستخدام</Link>

                    <Link href="/ar/contact">اتصل بنا</Link>

                    <div className="pt-6">
                        <span>مدعوم بواسطة </span>
                        <span>____</span>
                    </div>
                </div>

            </aside>
        </>
    );
}