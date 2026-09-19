import Link from "next/link";

import {
  Store,
  Hamburger,
  User,
  Calendar,
  TrendingUp,
  ShoppingBag,
} from "lucide-react";

import UrlComponent from "../components/search-params-component";


import { RestaurantTableIcon } from "@/components/icons/hugeicons-restaurant-table";
import getSummary from "@/api/dashboard/get-summary";

const PRIMARY_COLOR = "#B42318";

export default async function DashboardPage(
) {
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

        <UrlComponent/>


        <p className="text-xl font-semibold text-gray-600">
          إليك نظرة سريعة على أداء مطعمك.
        </p>

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
            {summary.ordersCount}
          </p>

          <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-green-600">
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



        </Link>
      </section>
    </main>
  );
}