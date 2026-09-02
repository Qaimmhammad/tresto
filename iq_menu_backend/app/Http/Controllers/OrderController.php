<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDineInOrderRequest;
use App\Http\Requests\StoreOrderRequest;
use App\Models\Branch;
use App\Models\Order;
use App\Models\Restaurant;
use App\Models\Table;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class OrderController extends Controller
{
    public function __construct(
        private OrderService $orderService
    ) {}

    public function store(
        StoreOrderRequest $request,
        Restaurant $restaurant,
        Branch $branch
    ): JsonResponse {
        $order = $this->orderService->create(
            $request->validated(),
            $restaurant,
            $branch
        );

        return response()->json([
            'data' => $order,
        ], 201);
    }

    public function storeDineIn(
        StoreDineInOrderRequest $request,
        Table $table
    ): JsonResponse {
        $order = $this->orderService->createDineIn(
            $request->validated(),
            $table
        );

        return response()->json([
            'data' => $order,
        ], 201);
    }

    public function changeStatus(
        string $orderId,
        string $status
    ): JsonResponse {
        $order = Order::find($orderId);

        if (!$order) {
            return response()->json([
                'message' => 'Order not found.',
            ], 404);
        }

        $order->update([
            'status' => $status,
        ]);

        return response()->json([
            'message' => 'Status updated successfully.',
            'status' => $order->status,
        ]);
    }

    public function getOrders(Request $request): JsonResponse
    {
        $user = $request->user();

        $period = $request->query('period', 'today');

        $request->validate([
            'period' => [
                'nullable',
                Rule::in([
                    'today',
                    'week',
                    'month',
                    'all',
                ]),
            ],
        ]);

        $query = Order::query()
            ->where('restaurant_id', $user->restaurant_id);

        if (in_array($user->role, ['employee', 'branch_manager'])) {
            $query->where('branch_id', $user->branch_id);
        }

        match ($period) {
            'today' => $query->whereDate(
                'created_at',
                now()->toDateString()
            ),

            'week' => $query->whereBetween(
                'created_at',
                [
                    now()->startOfWeek(),
                    now()->endOfWeek(),
                ]
            ),

            'month' => $query->whereBetween(
                'created_at',
                [
                    now()->startOfMonth(),
                    now()->endOfMonth(),
                ]
            ),

            'all' => null,
        };

        $orders = $query
            ->with([
                'items',
                'table',
                'branch',
            ])
            ->latest()
            ->get();

        return response()->json([
            'data' => $orders,
            'period' => $period,
        ]);
    }
}
