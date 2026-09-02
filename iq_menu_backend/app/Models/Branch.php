<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Restaurant;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Branch extends Model
{
    use HasUlids;

    protected $fillable = [
        "name",
        "longitude",
        "latitude",
        "address",
        "status",
        "restaurant_id"
    ];
    
    public function restaurant(): BelongsTo
    {
        return $this->belongsTo(Restaurant::class);
    }

    public function users(): HasMany 
    {
        return $this->hasMany(User::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function tables(): HasMany
    {
        return $this->hasMany(Table::class);
    }
}
