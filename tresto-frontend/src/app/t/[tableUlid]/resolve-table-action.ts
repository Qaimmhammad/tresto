"use server";

import serverFetch from "@/api/server-client";

export type ResolvedTable = {
    table_id: string;
    branch_id: string;
    number: number;
    restaurant_slug: string;
};

export async function resolveTableAction(
    tableId: string
): Promise<ResolvedTable> {
    const response = await serverFetch<{
        data: ResolvedTable;
    }>(`/t/${tableId}/menu`);

    return response.data;
}