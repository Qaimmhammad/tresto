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
        Branch $branch
    ): JsonResponse {
        $restaurant = Restaurant::where(
            'id',
            $branch->restaurant_id
        )->firstOrFail();

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

    public function show(
        Request $request,
        Order $order
    ): JsonResponse {
        $this->authorizeOrderAccess($request, $order);

        $order->load([
            'items',
            'table',
            'branch',
            'restaurant',
        ]);

        return response()->json([
            'data' => $order,
        ]);
    }

    public function changeStatus(
        Request $request,
        Order $order
    ): JsonResponse {
        $this->authorizeOrderAccess($request, $order);

        $request->validate([
            'status' => [
                'required',
                Rule::in([
                    'pending',
                    'accepted',
                    'preparing',
                    'ready',
                    'delivering',
                    'completed',
                    'rejected',
                    'cancelled',
                ]),
            ],
        ]);

        $newStatus = $request->string('status')->toString();

        $allowedTransitions = [
            'pending' => [
                'accepted',
                'rejected',
                'cancelled',
            ],

            'accepted' => [
                'preparing',
                'cancelled',
            ],

            'preparing' => [
                'ready',
                'cancelled',
            ],

            'ready' => [
                'delivering',
                'completed',
                'cancelled',
            ],

            'delivering' => [
                'completed',
                'cancelled',
            ],

            'completed' => [],

            'rejected' => [],

            'cancelled' => [],
        ];

        $currentStatus = $order->status;

        if (
            ! in_array(
                $newStatus,
                $allowedTransitions[$currentStatus] ?? [],
                true
            )
        ) {
            return response()->json([
                'message' => "Cannot change order status from {$currentStatus} to {$newStatus}.",
            ], 422);
        }

        $order->update([
            'status' => $newStatus,
        ]);

        return response()->json([
            'message' => 'Order status updated successfully.',
            'data' => $order->fresh([
                'items',
                'table',
                'branch',
            ]),
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

        if (in_array($user->role, [
            'employee',
            'branch_manager',
        ])) {
            $query->where(
                'branch_id',
                $user->branch_id
            );
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

    private function authorizeOrderAccess(
        Request $request,
        Order $order
    ): void {
        $user = $request->user();

        if (
            $order->restaurant_id !== $user->restaurant_id
        ) {
            abort(403, 'You do not have access to this order.');
        }

        if (
            in_array($user->role, [
                'employee',
                'branch_manager',
            ]) &&
            $order->branch_id !== $user->branch_id
        ) {
            abort(403, 'You do not have access to this order.');
        }
    }
}
