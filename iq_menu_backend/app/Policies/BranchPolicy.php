<?php

namespace App\Policies;

use App\Models\Branch;
use App\Models\User;

class BranchPolicy
{
    /**
     * Determine whether the user can view any branches.
     */
    public function viewAny(User $user): bool
    {
        return $user->role == "admin" || $user->role == "branch_manager";
    }

    /**
     * Determine whether the user can view the branch.
     */
    public function view(User $user, Branch $branch): bool
    {
        if ($user->role === 'admin') {
            return $user->restaurant_id === $branch->restaurant_id;
        }

        if ($user->role === 'branch_manager') {
            return $user->branch_id === $branch->id;
        }

        return false;
    }

    /**
     * Determine whether the user can create a branch.
     */
    public function create(User $user): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can update the branch.
     */
    public function update(User $user, Branch $branch): bool
    {
        if ($user->role === 'admin') {
            return $user->restaurant_id === $branch->restaurant_id;
        }

        if ($user->role === 'branch_manager') {
            return $user->branch_id === $branch->id;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the branch.
     */
    public function delete(User $user, Branch $branch): bool
    {
        return $user->role === 'admin'
            && $user->restaurant_id === $branch->restaurant_id;
    }
}
