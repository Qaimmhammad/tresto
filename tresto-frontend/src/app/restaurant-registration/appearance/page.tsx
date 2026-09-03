"use client";

import { useRef, useState } from "react";
import { ArrowLeft, LoaderCircle, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";

import registerRestaurant from "../actions";
import uploadLogo from "./action";

import { useRestaurantRegistrationStore } from "../../stores/restaurant-registration-store";

export default function RestaurantPreferencesPage() {
  const router = useRouter();
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [primaryColor, setPrimaryColor] = useState("#B42318");
  const [secondaryColor, setSecondaryColor] = useState("#ffffff");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];


    if (!file) return;

    setLogoFile(file);
    setLogoUrl(URL.createObjectURL(file));

  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoUrl("");

    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }

  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");

    const data = useRestaurantRegistrationStore.getState().data;

    if (!data.restaurant || !data.admin) {
      setError("Registration data is incomplete");
      setIsLoading(false);
      return;
    }

    try {
      let uploadedLogoUrl = "";

      if (logoFile) {
        uploadedLogoUrl = await uploadLogo(logoFile);
      }

      await registerRestaurant({
        restaurant: data.restaurant,
        admin: data.admin,
        restaurantSettings: {
          logoUrl: uploadedLogoUrl,
          primaryColor,
          secondaryColor,
          title,
          subtitle,
          heroImageUrl: null,
        },
      });

      router.push("/dashboard");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Restaurant registration failed"
      );
    } finally {
      setIsLoading(false);
    }

  };

  return (<div
    className="min-h-screen bg-[#FDFCFE] px-4 py-10"
    dir="rtl"
  > <div className="mx-auto w-full max-w-lg"> <div className="mb-8 text-center"> <h1 className="text-3xl font-bold text-gray-900">
    خصص مطعمك </h1>

    <p className="mt-3 text-gray-600">
      أضف الهوية والمظهر الخاص بصفحة مطعمك.
    </p>
  </div>

      <div className="space-y-6">
        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              شعار المطعم
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              اختر صورة تمثل هوية مطعمك.
            </p>
          </div>

          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleLogoChange}
          />

          {logoUrl ? (
            <div className="flex items-center gap-4">
              <div className="relative h-24 w-24 overflow-hidden rounded-2xl border border-gray-200">
                <img
                  src={logoUrl}
                  alt="Logo preview"
                  className="h-full w-full object-cover"
                />

                <button
                  type="button"
                  onClick={removeLogo}
                  className="absolute left-2 top-2 rounded-full bg-white p-1.5 text-red-500 shadow"
                >
                  <X size={16} />
                </button>
              </div>

              <button
                type="button"
                onClick={() =>
                  logoInputRef.current?.click()
                }
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                تغيير الصورة
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() =>
                logoInputRef.current?.click()
              }
              className="flex h-32 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 text-gray-500 transition hover:border-primary hover:bg-primary/5"
            >
              <Upload size={26} />

              <span className="mt-3">
                اختر شعار المطعم
              </span>
            </button>
          )}
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-gray-900">
              ألوان المطعم
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              اختر الألوان التي تمثل هوية مطعمك.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-2xl border border-gray-100 p-4">
              <div>
                <span className="block font-semibold text-gray-900">
                  اللون الأساسي
                </span>

                <span className="text-sm text-gray-500">
                  {primaryColor}
                </span>
              </div>

              <div className="relative h-12 w-12 overflow-hidden rounded-xl">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(event) =>
                    setPrimaryColor(event.target.value)
                  }
                  className="absolute inset-0 h-full w-full cursor-pointer border-0 bg-transparent"
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-gray-100 p-4">
              <div>
                <span className="block font-semibold text-gray-900">
                  اللون الثانوي{" "}
                  <span className="font-light text-gray-500">
                    اختياري
                  </span>
                </span>

                <span className="text-sm text-gray-500">
                  {secondaryColor}
                </span>
              </div>

              <div className="relative h-12 w-12 overflow-hidden rounded-xl">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(event) =>
                    setSecondaryColor(event.target.value)
                  }
                  className="absolute inset-0 h-full w-full cursor-pointer border-0 bg-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-gray-900">
              النصوص
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              هذه النصوص ستظهر في الصفحة الرئيسية للمطعم.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="mb-2 block font-semibold text-gray-900"
              >
                العنوان الرئيسي
              </label>

              <textarea
                id="title"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="مثال: أهلاً بكم في مطعمنا"
                maxLength={100}
                rows={1}
                className="w-full resize-none rounded-2xl border border-gray-200 px-5 py-3.5 text-black outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label
                htmlFor="subtitle"
                className="mb-2 block font-semibold text-gray-900 pl-4"
              >
                العنوان الفرعي

                <span className="mr-2 text-sm font-normal text-gray-400">
                  اختياري
                </span>
              </label>

              <textarea
                id="subtitle"
                value={subtitle}
                onChange={(event) =>
                  setSubtitle(event.target.value)
                }
                placeholder="اكتب وصفًا قصيرًا عن مطعمك"
                maxLength={200}
                rows={3}
                className="w-full resize-none rounded-2xl border border-gray-200 px-5 py-3.5 text-black outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="p-5">
            <h2 className="font-bold text-gray-900">
              معاينة سريعة
            </h2>
          </div>

          <div
            className="p-6 text-white"
            style={{
              backgroundColor: primaryColor,
            }}
          >
            {logoUrl && (
              <img
                src={logoUrl}
                alt="Restaurant logo"
                className="mb-4 h-16 w-16 rounded-2xl object-cover"
              />
            )}

            <h3 className="text-2xl font-bold wrap-break-word">
              {title || "عنوان مطعمك"}
            </h3>

            <p className="mt-2 text-sm opacity-80 wrap-break-word">
              {subtitle || "سيظهر وصف مطعمك هنا"}
            </p>

            <button
              type="button"
              className="mt-5 rounded-xl px-5 py-2.5 font-medium"
              style={{
                backgroundColor: secondaryColor,
                color: primaryColor,
              }}
            >
              استكشف القائمة
            </button>
          </div>
        </div>

        <div className="pt-4">
          {error && (
            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-white shadow-lg shadow-primary/30 transition-all hover:cursor-pointer hover:bg-primary/90"
          >
            متابعة
            {isLoading ? (
              <LoaderCircle
                size={20}
                className="animate-spin"
              />
            ) : (
              <ArrowLeft size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  </div>

  );
}
