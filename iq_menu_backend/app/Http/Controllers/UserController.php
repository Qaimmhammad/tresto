<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\Branch;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function store(StoreUserRequest $request)
    {
        $currentUser = $request->user();

        $validated = $request->validated();

        /*
        |--------------------------------------------------------------------------
        | ADMIN
        |--------------------------------------------------------------------------
        */

        if ($currentUser->role === 'admin') {

            /*
            | Admin users do not belong to a branch.
            */

            if ($validated['role'] === 'admin') {
                $validated['branch_id'] = null;
            }

            /*
            | Branch is required for branch managers and employees.
            */

            if (
                in_array($validated['role'], [
                    'branch_manager',
                    'employee',
                ])
                && empty($validated['branch_id'])
            ) {
                return response()->json([
                    'message' => 'Branch ID is required for this role.',
                ], 422);
            }

            /*
            | Make sure the branch belongs
            | to the admin's restaurant.
            */

            if (! empty($validated['branch_id'])) {

                $branchExists = Branch::where(
                    'id',
                    $validated['branch_id']
                )
                    ->where(
                        'restaurant_id',
                        $currentUser->restaurant_id
                    )
                    ->exists();

                if (! $branchExists) {
                    return response()->json([
                        'message' => 'This branch does not belong to your restaurant.',
                    ], 403);
                }
            }

            $user = User::create([
                'name' => $validated['name'],

                'user_name' => $validated['user_name'],

                'password' => Hash::make(
                    $validated['password']
                ),

                'role' => $validated['role'],

                /*
                | Never trust restaurant_id from the client.
                */

                'restaurant_id' => $currentUser->restaurant_id,

                'branch_id' => $validated['branch_id'],
            ]);

            return response()->json([
                'message' => 'User created successfully.',
                'user' => $user,
            ], 201);
        }

        /*
        |--------------------------------------------------------------------------
        | BRANCH MANAGER
        |--------------------------------------------------------------------------
        |
        | StoreUserRequest::authorize() already guarantees that
        | this user can only create an employee.
        |
        */

        $user = User::create([
            'name' => $validated['name'],

            'user_name' => $validated['user_name'],

            'password' => Hash::make(
                $validated['password']
            ),

            /*
            | Branch manager can only create employees.
            */

            'role' => 'employee',

            /*
            | Automatically inherit restaurant.
            */

            'restaurant_id' => $currentUser->restaurant_id,

            /*
            | Automatically inherit branch.
            */

            'branch_id' => $currentUser->branch_id,
        ]);

        return response()->json([
            'message' => 'Employee created successfully.',
            'user' => $user,
        ], 201);
    }

    public function update(
        UpdateUserRequest $request,
        string $id
    ) {
        $currentUser = $request->user();

        $user = User::find($id);

        if (! $user) {
            return response()->json([
                'message' => 'User not found.',
            ], 404);
        }


        if ($currentUser->role === 'admin') {

            /*
            | User must belong to the same restaurant.
            */

            if (
                $user->restaurant_id !==
                $currentUser->restaurant_id
            ) {
                return response()->json([
                    'message' => 'Unauthorized.',
                ], 403);
            }

            $validated = $request->validated();

            /*
            | Make sure the selected branch belongs
            | to the admin's restaurant.
            */

            if (
                array_key_exists('branch_id', $validated)
                && $validated['branch_id'] !== null
            ) {

                $branchExists = Branch::where(
                    'id',
                    $validated['branch_id']
                )
                    ->where(
                        'restaurant_id',
                        $currentUser->restaurant_id
                    )
                    ->exists();

                if (! $branchExists) {
                    return response()->json([
                        'message' => 'This branch does not belong to your restaurant.',
                    ], 403);
                }
            }

            /*
            | Admin users do not belong to branches.
            */

            if (
                isset($validated['role'])
                && $validated['role'] === 'admin'
            ) {
                $validated['branch_id'] = null;
            }

            /*
            | Hash password if it was changed.
            */

            if (isset($validated['password'])) {
                $validated['password'] = Hash::make(
                    $validated['password']
                );
            }

            $user->update($validated);

            return response()->json([
                'message' => 'User updated successfully.',
                'user' => $user,
            ]);
        }

        if (
            $user->role !== 'employee'
            ||
            $user->branch_id !==
            $currentUser->branch_id
        ) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $validated = $request->validated();

        /*
        | Hash password if it was changed.
        */

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make(
                $validated['password']
            );
        }

        $user->update($validated);

        return response()->json([
            'message' => 'User updated successfully.',
            'user' => $user,
        ]);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'user_name' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('user_name', $validated['user_name'])->firstOrFail();

        $is_logged = Hash::check($validated['password'], $user->password);

        if (! $user || ! $is_logged) {
            return response()->json([
                'message' => 'either password or user name is wrong',
            ], 404);
        }

        $token = $user->createToken('dashboard')->plainTextToken;

        return response()->json([
            'message' => 'user logged in successfully',
            'token' => $token,
        ]);
    }

    public function index(Request $request)
    {
        $currentUser = $request->user();

        if ($currentUser->role === 'admin') {
            $users = User::with("branch")->where('restaurant_id', $currentUser->restaurant_id)->get();
        } elseif ($currentUser->role === 'branch_manager') {
            $users = User::with("branch")->where('branch_id', $currentUser->branch_id)->get();
        } else {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        return response()->json(['data' => $users], 200);
    }


    public function destroy(Request $request, string $id)
    {
        $currentUser = $request->user();
        $user = User::find($id);

        if (! $user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        if ($currentUser->role === 'admin') {
            if ($user->restaurant_id !== $currentUser->restaurant_id) {
                return response()->json(['message' => 'Unauthorized.'], 403);
            }

            $user->delete();

            return response()->json(['message' => 'User deleted successfully.'], 200);
        }

        return response()->json(['message' => 'Unauthorized.'], 403);
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        $user->currentAccessToken()->delete();

        return response()->json([
            'message' => 'user logged out successfully',
        ], 200);
    }
}
