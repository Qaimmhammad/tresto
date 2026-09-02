<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMealRequest;
use App\Models\Category;
use App\Models\Meal;
use App\Models\Restaurant;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;

class MealController extends Controller
{
    use AuthorizesRequests ;
    public function index(Request $requset)
    {
        $user = $requset->user();
        $meals = Meal::where('restaurant_id', $user->restaurant_id)
            ->where('is_available', true)
            ->orderBy('created_at')
            ->get();

        return response()->json([
            'data' => $meals,
        ]);
    }

    public function store(StoreMealRequest $request)
    {
        $this->authorize('create', Meal::class);

        $category = Category::where('id', $request->category_id)
            ->where('restaurant_id', $request->user()->restaurant_id)
            ->firstOrFail();

        $meal = Meal::create([
            'restaurant_id' => $request->user()->restaurant_id,
            'category_id' => $category->id,
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'image_url' => $request->image_url,
            'is_available' => $request->boolean('is_available', true),
            'options' => $request->options,
        ]);

        return response()->json([
            'data' => $meal,
        ], 201);
    }

    public function show(Meal $meal)
    {
        abort_unless($meal->is_available, 404);

        return response()->json([
            'data' => $meal,
        ]);
    }

    public function update(StoreMealRequest $request, Meal $meal)
    {
        $this->authorize('update', $meal);

        if ($request->has('category_id')) {
            Category::where('id', $request->category_id)
                ->where('restaurant_id', $request->user()->restaurant_id)
                ->firstOrFail();
        }

        $meal->update($request->validated());

        return response()->json([
            'data' => $meal->fresh(),
        ]);
    }

    public function destroy(Meal $meal)
    {
        $this->authorize('delete', $meal);

        $meal->delete();

        return response()->json([
            'message' => 'Meal deleted successfully.',
        ]);
    }
}