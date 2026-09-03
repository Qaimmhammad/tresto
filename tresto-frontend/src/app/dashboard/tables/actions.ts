"use server";

import { revalidatePath } from "next/cache";
import serverFetch from "@/api/server-client";
import Table from "@/models/table-model";

export async function getTablesAction(): Promise<Table[]> {
    try {
        const response = await serverFetch<Table[]>("/dashboard/tables");
        return response.data || [];
    } catch {
        return [];
    }
}

export async function setTableCountAction(count: number): Promise<{ success: boolean; message?: string }> {
    try {
        const response = await serverFetch<Table[]>("/api/dashboard/tables/bulk", {
            method: "POST",
            body: JSON.stringify({ count }),
        });

        if (response) {
            revalidatePath("/dashboard/tables");
            return { success: true };
        }

        return { success: false, message: "حدث خطأ أثناء تحديث عدد الطاولات." };
    } catch (error: any) {
        return {
            success: false,
            message: error?.message || "حدث خطأ أثناء التواصل مع الخادم.",
        };
    }
}