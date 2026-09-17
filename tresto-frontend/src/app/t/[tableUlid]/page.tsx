import getRestaurantBySlug from "@/api/restaurant/get-restaurant-by-slug";
import PublicMenuClient from "@/app/r/[restaurantSlug]/public-menu-client";
import { resolveTableAction } from "./resolve-table-action";

type Props = {
    params: Promise<{
        tableUlid: string;
    }>;
};

export default async function TablePage({ params }: Props) {
    const { tableUlid } = await params;
    console.log(`TABLE ID FROM THE PAGE IS : ${tableUlid}`)

    const table = await resolveTableAction(tableUlid);

    const data = await getRestaurantBySlug(
        table.restaurant_slug
    );

    return (
        <PublicMenuClient
            data={data}
            slug={table.restaurant_slug}
            table={{
                id: tableUlid,
                branch_id: table.branch_id,
                number: table.number,
            }}
        />
    );
}