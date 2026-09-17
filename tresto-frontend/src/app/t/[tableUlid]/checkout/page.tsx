import CheckoutPage from './checkout-page'

type Props = {
    params: Promise<{
        tableUlid: string;
    }>;
};

export default async function Page({ params }: Props) {
    const { tableUlid } = await params;

    console.log("CHECKOUT TABLE ULID:", tableUlid);

    return <CheckoutPage tableId={tableUlid} />;
}