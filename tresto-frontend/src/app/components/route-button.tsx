"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type ButtonProps = {
    title: string;
    fontSize: number;
    fontWeight: "bold" | "normal" | "semibold";
    type: "submit" | "reset" | "button"
};

export default function RouteButton({
    title,
    fontSize,
    fontWeight,
    type
}: ButtonProps) {

    return (
        <div className="pt-4">
            <button
                type={type}
                style={{ fontSize }}
                className={`hover:cursor-pointer  w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-2xl transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2 font-${fontWeight}`}
            >
                {title}
                <ArrowLeft size={20} />
            </button>
        </div>
    );
}