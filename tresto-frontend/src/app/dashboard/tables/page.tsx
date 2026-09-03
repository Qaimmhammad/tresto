import Link from "next/link";
import { getTablesAction } from "./actions";
import { Plus, Printer, Utensils } from "lucide-react";
import { TablesListClient } from "./TablesListClient";

export default async function TablesPage() {
    const tables = await getTablesAction();
    const sortedTables = [...tables].sort((a, b) => a.tableNumber - b.tableNumber);

    return (
        <div className="space-y-6 p-6" dir="rtl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">الطاولات</h1>
                    <p className="text-sm text-muted-foreground">إدارة طاولات المطعم وإنشاء رموز QR الخاصة بالطلبات</p>
                </div>
                <div className="flex items-center gap-3">
                    {sortedTables.length > 0 && (
                        <Link
                            href="/dashboard/tables/print"
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium border rounded-lg hover:bg-accent transition-colors"
                        >
                            <Printer className="w-4 h-4" />
                            طباعة رموز QR
                        </Link>
                    )}
                    <Link
                        href="/dashboard/tables/add"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        إضافة طاولات
                    </Link>
                </div>
            </div>

            {sortedTables.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed bg-card">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                        <Utensils className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">لا توجد طاولات بعد</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mb-6">
                        أدخل عدد الطاولات الموجودة في مطعمك وسيتم إنشاؤها تلقائياً.
                    </p>
                    <Link
                        href="/dashboard/tables/add"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        إضافة طاولات
                    </Link>
                </div>
            ) : (
                <TablesListClient initialTables={sortedTables} />
            )}
        </div>
    );
}