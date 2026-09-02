<?php

namespace App\Policies;

use App\Models\Category;
use App\Models\User;

class CategoryPolicy
{
    /**
     * Determine whether the user can view any categories.
     */
    public function viewAny(User $user): bool
    {
        return in_array($user->role, [
            'admin',
            'branch_manager',
        ], true);
    }

    /**
     * Determine whether the user can view the category.
     */
    public function view(User $user, Category $category): bool
    {
        if ($user->role === 'admin') {
            return $user->restaurant_id === $category->restaurant_id;
        }

        if ($user->role === 'branch_manager') {
            return $user->restaurant_id === $category->restaurant_id;
        }

        return false;
    }

    /**
     * Determine whether the user can create a category.
     */
    public function create(User $user): bool
    {
        return in_array($user->role, [
            'admin',
            'branch_manager',
        ], true);
    }

    /**
     * Determine whether the user can update the category.
     */
    public function update(User $user, Category $category): bool
    {
        if ($user->role === 'admin') {
            return $user->restaurant_id === $category->restaurant_id;
        }

        if ($user->role === 'branch_manager') {
            return $user->restaurant_id === $category->restaurant_id;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the category.
     */
    public function delete(User $user, Category $category): bool
    {
        if ($user->role === 'admin') {
            return $user->restaurant_id === $category->restaurant_id;
        }

        if ($user->role === 'branch_manager') {
            return $user->restaurant_id === $category->restaurant_id;
        }

        return false;
    }
}