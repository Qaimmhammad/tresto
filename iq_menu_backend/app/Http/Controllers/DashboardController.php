<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Meal;
use App\Models\Order;
use App\Models\Table;
use App\Models\User;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;

class DashboardController extends Controller
{
    public function summary(Request $request)
    {
        $user = $request->user();
        $restaurantId = $user->restaurant_id;

        return response()->json([
            'mealsCount' => Meal::where(
                'restaurant_id',
                $restaurantId
            )->count(),

            'branchesCount' => Branch::where(
                'restaurant_id',
                $restaurantId
            )->count(),

            'employeesCount' => User::where(
                'restaurant_id',
                $restaurantId
            )->count(),

            'tablesCount' => Table::whereHas(
                'branch',
                function ($query) use ($restaurantId) {
                    $query->where('restaurant_id', $restaurantId);
                }
            )->count(),

            'ordersCount' => Order::where(
                'restaurant_id',
                $restaurantId
            )->count(),

            'ordersCountToday' => Order::where(
                'restaurant_id',
                $restaurantId
            )->whereDate('created_at', Date::today())->count(),

            'mostOrderedItems' => OrderItem::whereHas(
                'order.branch',
                function ($query) use ($restaurantId) {
                    $query->where(
                        'restaurant_id',
                        $restaurantId
                    );
                }
            )
                ->select('meal_id')
                ->selectRaw('SUM(quantity) as orders_count')
                ->groupBy('meal_id')
                ->orderByDesc('orders_count')
                ->with('meal:id,name')
                ->limit(5)
                ->get(),
        ]);
    }

    public function branch_manager_dashboard(Request $request)
    {
        $user = $request->user();

        if(!$user.in_array(["admin" , "branch_manager"]));

        $response = [
            "" => ""
        ];
    }
}
