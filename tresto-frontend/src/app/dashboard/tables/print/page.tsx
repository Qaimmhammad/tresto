"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function PrintTablesPage() {
    const searchParams = useSearchParams();
    const idsParam = searchParams.get("ids");
    const ids = idsParam ? idsParam.split(",") : [];
    const [origin, setOrigin] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            setOrigin(window.location.origin);
        }
    }, []);

    useEffect(() => {
        if (ids.length > 0 && origin) {
            const timer = setTimeout(() => {
                window.print();
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [ids, origin]);

    if (ids.length === 0) {
        return (
            <div className="p-8 text-center text-muted-foreground" dir="rtl">
                لم يتم تحديد أي طاولات للطباعة.
            </div>
        );
    }

    return (
        <div className="p-6 bg-white text-black min-h-screen" dir="rtl">
            <div className="flex items-center justify-between mb-8 print:hidden">
                <h1 className="text-xl font-bold">جاهز للطباعة ({ids.length} رمز QR)</h1>
                <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-5 py-2 bg-black text-white rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors"
                >
                    طباعة الآن
                </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 print:grid-cols-3 print:gap-6">
                {ids.map((id, index) => {
                    const qrUrl = origin ? `${origin}/t/${id}` : "";

                    return (
                        <div
                            key={id}
                            className="flex flex-col items-center justify-center p-2 break-inside-avoid"
                        >
                            <div className="p-4 border-2 border-dashed border-gray-400 rounded-2xl flex items-center justify-center bg-white">
                                {qrUrl ? (
                                    <QRCodeSVG value={qrUrl} size={150} level="M" />
                                ) : (
                                    <div className="w-[150px] h-[150px] bg-gray-100 animate-pulse rounded" />
                                )}
                            </div>
                            
                            <span className="text-xs font-semibold mt-2 text-gray-700">
                                طاولة {index + 1}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}