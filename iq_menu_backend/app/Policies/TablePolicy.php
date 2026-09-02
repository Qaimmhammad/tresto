<?php

namespace App\Policies;

use App\Models\Table;
use App\Models\User;

class TablePolicy
{
    /**
     * Determine whether the user can view any tables.
     */
    public function viewAny(User $user): bool
    {
        return in_array($user->role, [
            'admin',
            'branch_manager',
            'employee',
        ], true);
    }

    /**
     * Determine whether the user can view the table.
     */
    public function view(User $user, Table $table): bool
    {
        if ($user->role === 'admin') {
            return $user->restaurant_id === $table->branch->restaurant_id;
        }

        if (in_array($user->role, [
            'branch_manager',
            'employee',
        ], true)) {
            return $user->branch_id === $table->branch_id;
        }

        return false;
    }

    /**
     * Determine whether the user can create a table.
     */
    public function create(User $user): bool
    {
        return in_array($user->role, [
            'admin',
            'branch_manager',
            'employee',
        ], true);
    }

    /**
     * Determine whether the user can update the table.
     */
    public function update(User $user, Table $table): bool
    {
        if ($user->role === 'admin') {
            return $user->restaurant_id === $table->branch->restaurant_id;
        }

        if (in_array($user->role, [
            'branch_manager',
            'employee',
        ], true)) {
            return $user->branch_id === $table->branch_id;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the table.
     */
    public function delete(User $user, Table $table): bool
    {
        if ($user->role === 'admin') {
            return $user->restaurant_id === $table->branch->restaurant_id;
        }

        if (in_array($user->role, [
            'branch_manager',
            'employee',
        ], true)) {
            return $user->branch_id === $table->branch_id;
        }

        return false;
    }
}