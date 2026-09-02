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
        Schema::create('branches', function (Blueprint $table) {
            $table->ulid("id")->primary();
            $table->foreignUlid("restaurant_id")
                  ->constrained()
                  ->cascadeOnDelete();
            $table->string("name" , 50);
            $table->string("address" , 100);
            $table->decimal(column: "longitude" , total: 10 , places: 7)->nullable();
            $table->decimal(column: "latitude" , total: 10 , places: 7)->nullable();
            $table->string("status")->default("active");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('branches');
    }
};
