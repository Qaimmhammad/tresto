<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Table;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use DB;

class TableController extends Controller
{
    use AuthorizesRequests;

    /**
     * Get all tables of a branch.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $branchId = $user->branch_id ; 
        if (!$branchId){
            return response()->json([
                "message" => "tables should be managed from a branch manager account",
            ], 422);
        }
        $this->authorize('viewAny', Table::class);

        $tables = Table::where('branch_id', $branchId)
            ->orderBy('table_number')
            ->get();

        return response()->json([
            'data' => $tables,
        ]);
    }

    /**
     * Create a new table.
     */
    public function store(Request $request, string $branchId): JsonResponse
    {
        $this->authorize('create', Table::class);

        $validated = $request->validate([
            'table_number' => ['required', 'integer', 'min:1'],
        ]);

        $token = Str::random(32);

        $qrData = url("/t/{$token}");

        $branch = Branch::findOrFail($branchId);

        $table = $branch->tables()->create([
            'table_number' => $validated['table_number'],
            'qr_code' => $qrData,
        ]);

        return response()->json([
            'message' => 'Table created successfully.',
            'data' => $table,
        ], 201);
    }

    /**
     * Get one table.
     */
    public function show(string $id): JsonResponse
    {
        $table = Table::findOrFail($id);
        $this->authorize('view', $table);

        return response()->json([
            'data' => $table,
        ]);
    }

    /**
     * Update a table.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $table = Table::findOrFail($id);
        $this->authorize('update', $table);

        $validated = $request->validate([
            'number' => ['required', 'integer', 'min:1'],
        ]);

        $table->update([
            'table_number' => $validated['number'],
        ]);

        return response()->json([
            'message' => 'Table updated successfully.',
            'data' => $table->fresh(),
        ]);
    }

    /**
     * Delete a table.
     */
    public function destroy(string $id): JsonResponse
    {
        $table = Table::findOrFail($id);
        $this->authorize('delete', $table);

        $table->delete();

        return response()->json([
            'message' => 'Table deleted successfully.',
        ]);
    }

    public function resolveQr(string $token): JsonResponse
    {
        $table = Table::where(
            'qr_code',
            url("/t/{$token}")
        )->firstOrFail();

        return response()->json([
            'data' => [
                'table_id' => $table->id,
                'branch_id' => $table->branch_id,
                'number' => $table->table_number,
            ],
        ]);
    }

    public function setCount(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'count' => ['required', 'integer', 'min:1'],
        ]);

        $requestedCount = $validated['count'];

        $result = DB::transaction(function () use ($requestedCount) {
            $currentCount = Table::count();

            if ($requestedCount <= $currentCount) {
                return [
                    'created' => 0,
                    'current_count' => $currentCount,
                    'requested_count' => $requestedCount,
                ];
            }

            $tablesToCreate = [];

            $nextNumber = $currentCount + 1;

            for (
                $number = $nextNumber;
                $number <= $requestedCount;
                $number++
            ) {
                $tablesToCreate[] = [
                    'id' => (string) Str::ulid(),
                    'number' => $number,
                ];
            }

            Table::insert($tablesToCreate);

            return [
                'created' => count($tablesToCreate),
                'current_count' => $requestedCount,
                'requested_count' => $requestedCount,
            ];
        });

        return response()->json([
            'message' => $result['created'] > 0
                ? 'Tables created successfully.'
                : 'No new tables were created.',
            'data' => $result,
        ]);
    }
}
