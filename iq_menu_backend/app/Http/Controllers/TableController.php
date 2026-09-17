<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Table;
use DB;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TableController extends Controller
{
    use AuthorizesRequests;

    /**
     * Get all tables of a branch.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $this->authorize('viewAny', Table::class);

        $query = Table::query()->orderBy('table_number');

        if ($user->role === 'admin') {
            if (! $user->restaurant_id) {
                return response()->json([
                    'message' => 'Admin is not associated with any restaurant.',
                ], 422);
            }

            // الآدمن يرى طاولات جميع فروع مطعمه
            $branchIds = Branch::where('restaurant_id', $user->restaurant_id)->pluck('id');
            $query->whereIn('branch_id', $branchIds);
        } else {
            // مدير الفرع يرى طاولات فرعه المحدد فقط
            if (! $user->branch_id) {
                return response()->json([
                    'message' => 'Tables should be managed from a branch manager account.',
                ], 422);
            }

            $query->where('branch_id', $user->branch_id);
        }

        $tables = $query->get();

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

        $qrData = url("https://tresto.strangled.net/t/{$token}");

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
            "https://tresto.strangled.net/t/{$token}"
        )
            ->with('branch.restaurant')
            ->firstOrFail();

        return response()->json([
            'data' => [
                'table_id' => $table->id,
                'branch_id' => $table->branch_id,
                'number' => $table->table_number,
                'restaurant_slug' => $table->branch->restaurant->slug,
            ],
        ]);
    }

    public function setCount(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'count' => ['required', 'integer', 'min:1'],
            'branch_id' => ['required', 'exists:branches,id'],
        ]);

        $requestedCount = $validated['count'];
        $branchId = $validated['branch_id'];

        $result = DB::transaction(function () use ($requestedCount, $branchId) {
            $currentCount = Table::where('branch_id', $branchId)->count();

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
                $tablesId = (string) Str::ulid();
                $tablesToCreate[] = [
                    'id' => $tablesId,
                    'table_number' => $number,
                    'branch_id' => $branchId,
                    'qr_code' => "https://tresto.strangled.net/t/$tablesId",
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
