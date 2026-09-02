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
        Schema::create('restaurants', function (Blueprint $table) {
            $table->ulid(column: "id")->primary();
            $table->string(column: "name" ,length: 50)->nullable(value: false);
            $table->string(column: "slug" , length: 50)->nullable(value: false)->unique();
            $table->string(column: "status")->default("free_tire");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('restaurants');
    }
};
