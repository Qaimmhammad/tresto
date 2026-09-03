import Link from "next/link";

import {
  Store,
  Hamburger,
  User,
  Calendar,
  TrendingUp,
  ShoppingBag,
} from "lucide-react";

import { RestaurantTableIcon } from "@/components/icons/hugeicons-restaurant-table";
import getSummary from "@/api/dashboard/get-summary";

const PRIMARY_COLOR = "#B42318";

export default async function DashboardPage() {
  const summary = await getSummary();

  const statCards = [
    {
      title: "الوجبات",
      value: summary.mealsCount,
      icon: Hamburger,
      href: "/dashboard/meals",
    },
    {
      title: "الفروع",
      value: summary.branchesCount,
      icon: Store,
      href: "/dashboard/branches",
    },
    {
      title: "الموظفون",
      value: summary.employeesCount,
      icon: User,
      href: "/dashboard/employees",
    },

    {
      title: "الطاولات",
      value: summary.tablesCount,
      icon: RestaurantTableIcon,
      href: "/dashboard/tables",
    },
  ];

  return (
    <main
      dir="rtl"
      className="min-h-screen space-y-6 bg-[#FAF8F5] p-4 text-right"
    >
      {/* Header */}
      <section className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-gray-950">
          مرحباً بعودتك 👋
        </h1>

        <p className="text-sm font-medium text-gray-600">
          إليك نظرة سريعة على أداء مطعمك.
        </p>

        <div className="flex items-center justify-end gap-1.5 pt-1 text-xs font-medium text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>12 أكتوبر 2024</span>
        </div>
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-2 gap-3">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <Link
              key={card.title}
              href={card.href}
              className="flex h-32 flex-col justify-between rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm transition hover:shadow-md active:scale-[0.98]"
            >
              <div className="flex items-start justify-between">
                <span className="text-3xl font-bold tracking-tight text-gray-950">
                  {card.value.toLocaleString()}
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
            </Link>
          );
        })}
      </section>

      {/* Orders Overview */}
      <section className="grid grid-cols-2 gap-3">
        {/* Total Orders */}
        <Link
          href="/dashboard/orders"
          className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm transition hover:shadow-md active:scale-[0.98]"
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-600">
              إجمالي الطلبات
            </span>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#B42318]/10">
              <ShoppingBag
                className="h-4.5 w-4.5"
                style={{
                  color: PRIMARY_COLOR,
                }}
              />
            </div>
          </div>

          <p className="text-3xl font-extrabold tracking-tight text-gray-950">
            {summary.ordersCount.toLocaleString()}
          </p>

          <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-green-600">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>12% مقارنة بالفترة السابقة</span>
          </div>
        </Link>

        {/* Today's Orders */}
        <Link
          href="/dashboard/orders"
          className="rounded-2xl p-4 text-white shadow-sm transition hover:opacity-95 active:scale-[0.98]"
          style={{
            backgroundColor: PRIMARY_COLOR,
          }}
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-white/80">
              طلبات اليوم
            </span>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
              <ShoppingBag className="h-4.5 w-4.5 text-white" />
            </div>
          </div>

          <p className="text-3xl font-extrabold tracking-tight">
            {summary.ordersTodayCount}
          </p>

          <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-white/80">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>5% مقارنة بالأمس</span>
          </div>
        </Link>
      </section>

      {/* Most Ordered Items */}
      <div
        className="block rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition hover:shadow-md active:scale-[0.995]"
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-950">
              الأكثر طلباً
            </h2>

            <p className="mt-1 text-xs font-medium text-gray-500">
              الوجبات الأكثر طلباً في مطعمك
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#B42318]/10">
            <Hamburger
              className="h-5 w-5"
              style={{
                color: PRIMARY_COLOR,
              }}
            />
          </div>
        </div>

        <div className="space-y-3">
          {summary.mostOrderedItems?.length > 0 ? (
            summary.mostOrderedItems.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-xl bg-[#FAF8F5] p-3"
              >
                {/* Rank */}
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold"
                  style={{
                    backgroundColor:
                      index === 0 ? `${PRIMARY_COLOR}15` : "#F3F4F6",
                    color:
                      index === 0 ? PRIMARY_COLOR : "#4B5563",
                  }}
                >
                  {index + 1}
                </div>

                {/* Meal */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-gray-900">
                    {item.name}
                  </p>

                  <p className="mt-0.5 text-xs font-medium text-gray-500">
                    {item.ordersCount.toLocaleString()} طلب
                  </p>
                </div>

                {/* Indicator */}
                <div
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: PRIMARY_COLOR,
                  }}
                />
              </div>
            ))
          ) : (
            <div className="rounded-xl bg-[#FAF8F5] px-4 py-8 text-center">
              <Hamburger className="mx-auto h-8 w-8 text-gray-300" />

              <p className="mt-3 text-sm font-semibold text-gray-600">
                لا توجد طلبات كافية حتى الآن
              </p>

              <p className="mt-1 text-xs text-gray-400">
                ستظهر الوجبات الأكثر طلباً هنا.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}