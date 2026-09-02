<?php

namespace App\Policies;

use App\Models\Restaurant;
use App\Models\User;

class RestaurantPolicy
{
    /**
     * Determine whether the user can view any restaurants.
     */
    public function viewAny(User $user): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can view the restaurant.
     */
    public function view(User $user, Restaurant $restaurant): bool
    {
        return $user->role === 'admin'
            && $user->restaurant_id === $restaurant->id;
    }

    /**
     * Determine whether the user can create a restaurant.
     */
    public function create(User $user): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can update the restaurant.
     */
    public function update(User $user, Restaurant $restaurant): bool
    {
        return $user->role === 'admin'
            && $user->restaurant_id === $restaurant->id;
    }

    /**
     * Determine whether the user can delete the restaurant.
     */
    public function delete(User $user, Restaurant $restaurant): bool
    {
        return $user->role === 'admin'
            && $user->restaurant_id === $restaurant->id;
    }
}