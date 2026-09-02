<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RestaurantSetting extends Model
{
    use HasUlids;
    protected $fillable = [
        "logo_url",
        "primary_color",
        "secondary_color",
        "title",
        "subtitle",
        "hero_image_url",
        "restaurant_id"
    ];
    
    public function restaurant(): BelongsTo
    {
        return $this->belongsTo(Restaurant::class);
    }
}
