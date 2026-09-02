<?php

namespace App\Services;

use App\Events\OrderCreated;
use App\Models\Branch;
use App\Models\Meal;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Restaurant;
use App\Models\Table;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderService
{
    public function create(
        array $data,
        Restaurant $restaurant,
        Branch $branch
    ): Order {
        return DB::transaction(function () use ($data, $restaurant, $branch) {
            if ($branch->restaurant_id !== $restaurant->id) {
                throw ValidationException::withMessages([
                    'branch' => 'The selected branch does not belong to this restaurant.',
                ]);
            }

            return $this->createOrder(
                data: $data,
                restaurant: $restaurant,
                branch: $branch,
                table: null,
                orderType: $data['order_type']
            );
        });
    }

    public function createDineIn(
        array $data,
        Table $table
    ): Order {
        return DB::transaction(function () use ($data, $table) {
            $table->loadMissing('branch.restaurant');

            $branch = $table->branch;

            if (!$branch) {
                throw ValidationException::withMessages([
                    'table' => 'This table is not associated with a branch.',
                ]);
            }

            $restaurant = $branch->restaurant;

            if (!$restaurant) {
                throw ValidationException::withMessages([
                    'table' => 'This table is not associated with a restaurant.',
                ]);
            }

            return $this->createOrder(
                data: $data,
                restaurant: $restaurant,
                branch: $branch,
                table: $table,
                orderType: 'dine_in'
            );
        });
    }

    private function createOrder(
        array $data,
        Restaurant $restaurant,
        Branch $branch,
        ?Table $table,
        string $orderType
    ): Order {
        $mealIds = collect($data['items'])
            ->pluck('meal_id')
            ->unique();

        $meals = Meal::whereIn('id', $mealIds)
            ->where('restaurant_id', $restaurant->id)
            ->where('is_available', true)
            ->get()
            ->keyBy('id');

        if ($meals->count() !== $mealIds->count()) {
            throw ValidationException::withMessages([
                'items' => 'One or more meals are unavailable or do not belong to this restaurant.',
            ]);
        }

        $order = Order::create([
            'restaurant_id' => $restaurant->id,
            'branch_id' => $branch->id,
            'table_id' => $table?->id,
            'address' => $data['address'] ?? null,
            'customer_name' => $data['customer_name'],
            'customer_phone_number' => $data['customer_phone_number'] ?? null,
            'description' => $data['description'] ?? null,
            'order_type' => $orderType,
            'status' => 'pending',
            'total_price' => 0,
        ]);

        broadcast(new OrderCreated($order));

        $totalPrice = 0;

        foreach ($data['items'] as $item) {
            $meal = $meals[$item['meal_id']];

            $quantity = $item['quantity'];

            $selectedOptions = $item['selected_options'] ?? [];

            $optionsPrice = 0;

            foreach ($selectedOptions as $selectedOption) {
                $option = collect($meal->options)
                    ->firstWhere('name', $selectedOption);

                if (!$option) {
                    throw ValidationException::withMessages([
                        'items' => "Invalid option '{$selectedOption}' for meal '{$meal->name}'.",
                    ]);
                }

                $optionsPrice += $option['price'];
            }

            $unitPrice = $meal->price + $optionsPrice;

            $itemTotalPrice = $unitPrice * $quantity;

            $totalPrice += $itemTotalPrice;

            OrderItem::create([
                'order_id' => $order->id,
                'meal_id' => $meal->id,
                'meal_name' => $meal->name,
                'quantity' => $quantity,
                'unit_price' => $unitPrice,
                'selected_options' => $selectedOptions,
                'total_price' => $itemTotalPrice,
            ]);
        }

        $order->update([
            'total_price' => $totalPrice,
        ]);

        return $order->load('items');
    }
}