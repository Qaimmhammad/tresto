"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
    const handlePrint = () => {
        window.print();
    };

    return (
        <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium border rounded-lg hover:bg-accent transition-colors print:hidden"
        >
            <Printer className="w-4 h-4" />
            طباعة رموز QR
        </button>
    );
}