"use client";

import { useState } from "react";
import  Table  from "@/models/table-model";
import { TableCard } from "./TableCard";
import { Printer, CheckSquare, Square } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
    initialTables: Table[];
};

export function TablesListClient({ initialTables }: Props) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const router = useRouter();

    const toggleSelect = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === initialTables.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(initialTables.map((t) => t.id));
        }
    };

    const handlePrintSelected = () => {
        if (selectedIds.length === 0) return;
        const query = selectedIds.join(",");
        router.push(`/dashboard/tables/print?ids=${encodeURIComponent(query)}`);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between bg-card p-3 rounded-lg border text-sm">
                <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                    {selectedIds.length === initialTables.length ? (
                        <CheckSquare className="w-4 h-4 text-primary" />
                    ) : (
                        <Square className="w-4 h-4" />
                    )}
                    <span>تحديد الكل ({initialTables.length})</span>
                </button>

                {selectedIds.length > 0 && (
                    <button
                        type="button"
                        onClick={handlePrintSelected}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    >
                        <Printer className="w-3.5 h-3.5" />
                        طباعة المحدد ({selectedIds.length})
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {initialTables.map((table) => (
                    <TableCard
                        key={table.id}
                        table={table}
                        selectable
                        isSelected={selectedIds.includes(table.id)}
                        onToggleSelect={toggleSelect}
                    />
                ))}
            </div>
        </div>
    );
}