<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Restaurant extends Model
{
    use HasUlids;
    protected $table = "restaurants";

    protected $fillable = [
        "name",
        "slug",
        "status"
    ];

    public function branches(): HasMany 
    {
        // This will expect a "restaurant_id" column in the branches table
        return $this->hasMany(Branch::class);
    }

    public function users(): HasMany
    {
        // This will expect a "restaurant_id" column in the users table
        return $this->hasMany(User::class);
    }

    public function settings(): HasOne
    {
        return $this->hasOne(RestaurantSetting::class);
    }

    public function categories(): HasMany
    {
        return $this->hasMany(Category::class);
    }

    public function meals(): HasMany
    {
        return $this->hasMany(Meal::class);
    }

    public function orders(): HasMany 
    {
        return $this->hasMany(Order::class);
    }
}
