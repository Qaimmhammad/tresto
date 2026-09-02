<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Exception;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class CategoryController extends Controller implements HasMiddleware
{
    use AuthorizesRequests;
    public static function middleware(): array
    {
        return [
            new Middleware('auth:sanctum', only: [
                'store',
                'update',
                'destroy',
            ]),
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Category::class);

        try {
            $categories = Category::where(
                'restaurant_id',
                $request->user()->restaurant_id
            )->get();

            return response()->json($categories, 200);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to get categories.',
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', Category::class);

        try {
            $validated = $request->validate([
                'name' => ['required', 'string', 'min:3', 'max:20'],
            ]);

            $category = Category::create([
                'name' => $validated['name'],
                'restaurant_id' => $request->user()->restaurant_id,
            ]);

            return response()->json($category, 201);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to create category.',
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, string $id)
    {
        try {
            $category = Category::where('restaurant_id', $request->user()->restaurant_id)
                ->findOrFail($id);
            $this->authorize('view', $category);

            return response()->json($category, 200);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Category not found.',
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $validated = $request->validate([
                'name' => ['required', 'string', 'min:3', 'max:20'],
            ]);

            $category = Category::where(
                'restaurant_id',
                $request->user()->restaurant_id
            )->findOrFail($id);
            $this->authorize('update', $category);

            $category->update([
                'name' => $validated['name'],
            ]);

            return response()->json($category, 200);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to update category.',
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        try {
            $category = Category::where(
                'restaurant_id',
                $request->user()->restaurant_id
            )->findOrFail($id);
            $this->authorize('delete', $category);

            $category->delete();

            return response()->json([
                'message' => 'Category deleted successfully.',
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to delete category.',
            ], 500);
        }
    }
}