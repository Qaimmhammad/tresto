<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('restaurant_settings', function (Blueprint $table) {
            $table->ulid("id")->primary();
            $table->foreignUlid("restaurant_id")
                  ->constrained()
                  ->cascadeOnDelete();
            $table->string("primary_color" , 50);
            $table->string("secondary_color" , 50)->nullable(true);
            $table->string("logo_url")->nullable(false);
            $table->string("title");
            $table->string("subtitle")->nullable(true);
            $table->string("hero_image_url")->nullable(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('restaurant_settings');
    }
};
