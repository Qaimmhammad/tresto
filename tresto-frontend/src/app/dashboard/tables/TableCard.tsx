"use client";

import  Table  from "@/models/table-model";
import { QRCodeSVG } from "qrcode.react";
import { QrCode, CheckSquare, Square } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
    table: Table;
    isSelected?: boolean;
    onToggleSelect?: (id: string) => void;
    selectable?: boolean;
};

export function TableCard({ table, isSelected = false, onToggleSelect, selectable = false }: Props) {
    const [origin, setOrigin] = useState<string>("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            setOrigin(window.location.origin);
        }
    }, []);

    const qrUrl = origin ? `${origin}/t/${table.id}` : "";

    return (
        <div className={`p-5 rounded-xl border bg-card text-card-foreground shadow-sm transition-all ${isSelected ? "ring-2 ring-primary border-primary" : ""}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    {selectable && onToggleSelect && (
                        <button
                            type="button"
                            onClick={() => onToggleSelect(table.id)}
                            className="text-muted-foreground hover:text-primary transition-colors"
                        >
                            {isSelected ? <CheckSquare className="w-5 h-5 text-primary" /> : <Square className="w-5 h-5" />}
                        </button>
                    )}
                    <span className="font-bold text-lg">طاولة {table.tableNumber}</span>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-medium">
                    متاحة
                </span>
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-muted/40 rounded-lg border border-dashed mb-4">
                {qrUrl ? (
                    <QRCodeSVG value={qrUrl} size={110} level="M" />
                ) : (
                    <div className="w-[110px] h-[110px] bg-muted animate-pulse rounded" />
                )}
                <span className="text-xs text-muted-foreground mt-2 dir-ltr">/t/{table.id.substring(0, 8)}...</span>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
                <span className="flex items-center gap-1">
                    <QrCode className="w-3.5 h-3.5" /> رمز QR جاهز
                </span>
            </div>
        </div>
    );
}