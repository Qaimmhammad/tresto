<?php

namespace App\Policies;

use App\Models\Meal;
use App\Models\User;

class MealPolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, Meal $meal): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->restaurant_id !== null;
    }

    public function update(User $user, Meal $meal): bool
    {
        return $user->restaurant_id === $meal->restaurant_id;
    }

    public function delete(User $user, Meal $meal): bool
    {
        return $user->restaurant_id === $meal->restaurant_id;
    }
}