<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRestaurantRequest;
use App\Models\Category;
use App\Models\Restaurant;
use App\Models\RestaurantSetting;
use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\Meal;

class RestaurantController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', Restaurant::class);

        try {
            $restaurants = Restaurant::all();

            return response()->json($restaurants, 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to get restaurants.',
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRestaurantRequest $request)
    {
        $result = DB::transaction(function () use ($request) {

            $data = $request->validated();

            $restaurantData = $data['restaurant'];
            $adminData = $data['admin'];
            $restaurantSettings = $data['settings'];

            $restaurantData['slug'] = Str::slug($restaurantData['name']);

            $restaurant = Restaurant::create($restaurantData);

            $adminData['restaurant_id'] = $restaurant->id;
            $adminData['role'] = 'admin';
            $adminData['branch_id'] = null;
            $adminData['password'] = Hash::make($adminData['password']);

            $admin = User::create($adminData);

            $restaurantSettings['restaurant_id'] = $restaurant->id;

            $settings = RestaurantSetting::create($restaurantSettings);

            $token = $admin->createToken('auth_token')->plainTextToken;

            return [
                'restaurant' => $restaurant,
                'admin' => $admin,
                'settings' => $settings,
                'token' => $token,
            ];
        });

        return response()->json([
            'message' => 'Restaurant registered successfully.',
            'restaurant' => $result['restaurant'],
            'admin' => $result['admin'],
            'settings' => $result['settings'],
            'token' => $result['token'],
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $restaurant = Restaurant::findOrFail($id);
            $this->authorize('view', $restaurant);

            return response()->json($restaurant, 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Restaurant not found.',
            ], 404);
        }
    }

    public function getRestaurantBySlug(Request $request)
    {
        $slug = $request->slug ; 

        $restaurant = Restaurant::where("slug" , $slug)->firstOrFail();

        $restaurant_settings = RestaurantSetting::where("restaurant_id" , $restaurant->id)->first();

        return response()->json([
            "restaurant" => $restaurant,
            "restaurant_settings" => $restaurant_settings
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $validated = $request->validate([
                'name' => ['required', 'string', 'min:5', 'max:50'],
            ]);

            $restaurant = Restaurant::findOrFail($id);
            $this->authorize('update', $restaurant);

            $validated['slug'] = Str::slug(
                $validated['name']
            );

            $restaurant->update($validated);

            return response()->json($restaurant, 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update restaurant.',
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $restaurant = Restaurant::findOrFail($id);
            $this->authorize('delete', $restaurant);

            $restaurant->delete();

            return response()->json([
                'message' => 'Restaurant deleted successfully.',
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete restaurant.',
            ], 500);
        }
    }

    public function getPublicData(Request $request) 
    {
        $slug = $request->query("slug");
        $restaurant = Restaurant::where("slug" , $slug)->firstOrFail();
        $categories = Category::where("restaurant_id" , $restaurant->id)->get();
        $meals = Meal::where("restaurant_id", $restaurant->id)->get();

        return response()->json([
            "meals" => $meals,
            "categories" => $categories
        ]);
    }
}
