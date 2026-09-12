"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function UrlComponent() {
  const params = useSearchParams();
  const [copied, setCopied] = useState<boolean>(false);
  const slug = params.get("slug") || "";
  const fullUrl = `https://tresto.strangled.net/r/${slug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full p-4 rounded-2xl bg-white shadow-sm border border-gray-200/80">
      <p className="text-gray-700 font-semibold text-right">الرابط الخاص بموقعك هو :</p>
      
      <div className="flex items-center justify-between gap-3 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
        {/* Copy Button (Left) */}
        <button
          onClick={handleCopy}
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 active:scale-95 transition-all shadow-sm"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-green-600 text-xs">تم النسخ</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-gray-600" />
              <span className="text-xs">نسخ</span>
            </>
          )}
        </button>

        {/* URL Text (Right) */}
        <span dir="ltr" className="font-mono text-sm sm:text-base font-semibold text-gray-800 truncate">
          {fullUrl}
        </span>
      </div>
    </div>
  );
}