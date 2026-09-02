<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBranchRequest;
use App\Http\Requests\UpdateBranchRequest;
use App\Models\Branch;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request ;

class BranchController extends Controller
{
    use AuthorizesRequests ; 
    public function index(Request $request): JsonResponse
    {
        $user = $request->user() ;

        $this->authorize('viewAny', Branch::class);

        $branches = Branch::where(
            'restaurant_id',
            $user->restaurant_id
        )->get();

        return response()->json([
            'data' => $branches,
        ]);
    }

    public function store(StoreBranchRequest $request): JsonResponse
    {
        $this->authorize('create', Branch::class);

        $branch = Branch::create([
            ...$request->validated(),
            'restaurant_id' => auth()->user()->restaurant_id,
        ]);

        return response()->json([
            'message' => 'Branch created successfully.',
            'data' => $branch,
        ], 201);
    }

    public function show(Branch $branch): JsonResponse
    {
        $this->authorize('view', $branch);

        return response()->json([
            'data' => $branch,
        ]);
    }

    public function update(
        UpdateBranchRequest $request,
        Branch $branch
    ): JsonResponse {
        $this->authorize('update', $branch);

        $branch->update(
            $request->validated()
        );

        return response()->json([
            'message' => 'Branch updated successfully.',
            'data' => $branch->fresh(),
        ]);
    }

    public function destroy(Branch $branch): JsonResponse
    {
        $this->authorize('delete', $branch);

        $branch->delete();

        return response()->json([
            'message' => 'Branch deleted successfully.',
        ]);
    }
}