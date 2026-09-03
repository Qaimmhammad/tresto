import { getTablesAction } from "../actions";
import { AddTablesForm } from "./AddTablesFrom";

export default async function AddTablesPage() {
    const tables = await getTablesAction();

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">إضافة طاولات</h1>
                <p className="text-sm text-muted-foreground">تحديد إجمالي عدد الطاولات المطلوب تواجدها في المطعم</p>
            </div>

            <AddTablesForm currentCount={tables.length} />
        </div>
    );
}