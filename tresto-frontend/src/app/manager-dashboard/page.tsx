import {
  Calendar,
  ShoppingBag,
  Utensils,
  TrendingUp,
} from "lucide-react";

import getEmployeeSummary from "@/api/dashboard/get-summary";
import Header from "../components/header";
import { RestaurantTableIcon } from "@/components/icons/hugeicons-restaurant-table";
import Link from "next/link";

const PRIMARY_COLOR = "#B42318";

export default async function EmployeeDashboardPage() {
  const summary = await getEmployeeSummary();

  const today = new Date().toLocaleDateString("ar-IQ", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const statCards = [
    {
      title: "طلبات اليوم",
      value: summary.ordersTodayCount,
      icon: ShoppingBag,
      href: "employee-dashboard"
    },
    {
      title: "إجمالي الطلبات",
      value: summary.ordersCount,
      icon: TrendingUp,
      href: "employee-dashboard"
    },
    {
      title: "عدد الوجبات",
      value: summary.mealsCount,
      icon: Utensils,
      href: "/dashboard/meals"
    },
    {
      title: "الطاولات",
      value: summary.tablesCount, 
      icon: RestaurantTableIcon,
      href: "dashboard/tables"
    }
  ];

  return (
    <main
      dir="rtl"
      className="min-h-screen space-y-6 bg-[#FAF8F5] p-4 text-right"
    >
      {/* Header */}
      <section className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-gray-950">
          مرحباً بك
        </h1>

        <p className="text-sm font-medium text-gray-600">
          إليك ملخص العمل في فرعك.
        </p>

        <div className="flex items-center justify-end gap-1.5 pt-1 text-xs font-medium text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>{today}</span>
        </div>
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-2 gap-3">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <Link
            href={card.href}
            >
            <div
              key={card.title}
              className="flex h-32 flex-col justify-between rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <span className="text-3xl font-bold tracking-tight text-gray-950">
                  {card.value}
                </span>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#B42318]/10">
                  <Icon
                    className="h-5 w-5"
                    style={{
                      color: PRIMARY_COLOR,
                    }}
                  />
                </div>
              </div>

              <span className="text-sm font-semibold text-gray-600">
                {card.title}
              </span>
            </div>
            </Link>
          );
        })}
      </section>

      {/* Most Ordered Meals */}
      <section className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-950">
              أكثر الوجبات طلباً
            </h2>

            <p className="mt-1 text-xs font-medium text-gray-500">
              الوجبات الأكثر طلباً في الفرع.
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#B42318]/10">
            <TrendingUp
              className="h-5 w-5"
              style={{
                color: PRIMARY_COLOR,
              }}
            />
          </div>
        </div>

        <div className="space-y-3">
          {summary.mostOrderedItems.length > 0 ? (
            summary.mostOrderedItems.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl border border-gray-100 bg-[#FAF8F5] p-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold"
                    style={{
                      backgroundColor: `${PRIMARY_COLOR}12`,
                      color: PRIMARY_COLOR,
                    }}
                  >
                    {index + 1}
                  </div>

                  <span className="truncate text-sm font-bold text-gray-950">
                    {item.name}
                  </span>
                </div>

                <span className="shrink-0 text-sm font-bold text-gray-600">
                  {item.ordersCount.toLocaleString()} طلب
                </span>
              </div>
            ))
          ) : (
            <div className="rounded-xl bg-[#FAF8F5] px-4 py-10 text-center">
              <ShoppingBag className="mx-auto h-8 w-8 text-gray-300" />

              <p className="mt-3 text-sm font-semibold text-gray-600">
                لا توجد بيانات للطلبات
              </p>

              <p className="mt-1 text-xs font-medium text-gray-400">
                ستظهر إحصائيات الوجبات هنا بعد وصول الطلبات.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Branch Overview */}
      <section className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-gray-950">
            نظرة عامة
          </h2>

          <p className="mt-1 text-xs font-medium text-gray-500">
            معلومات النظام الحالية.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-[#FAF8F5] p-4">
            <span className="text-2xl font-bold text-gray-950">
              {summary.tablesCount.toLocaleString()}
            </span>

            <p className="mt-1 text-xs font-semibold text-gray-500">
              الطاولات
            </p>
          </div>

          <div className="rounded-xl bg-[#FAF8F5] p-4">
            <span className="text-2xl font-bold text-gray-950">
              {summary.employeesCount.toLocaleString()}
            </span>

            <p className="mt-1 text-xs font-semibold text-gray-500">
              الموظفين
            </p>
          </div>

          <div className="rounded-xl bg-[#FAF8F5] p-4">
            <span className="text-2xl font-bold text-gray-950">
              {summary.branchesCount.toLocaleString()}
            </span>

            <p className="mt-1 text-xs font-semibold text-gray-500">
              الفروع
            </p>
          </div>

          <div className="rounded-xl bg-[#FAF8F5] p-4">
            <span className="text-2xl font-bold text-gray-950">
              {summary.mealsCount.toLocaleString()}
            </span>

            <p className="mt-1 text-xs font-semibold text-gray-500">
              الوجبات
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

