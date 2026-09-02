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
        Schema::create('order_items', function (Blueprint $table) {
            $table->ulid("id")->primary();
            $table->foreignUlid("order_id")->constrained()->cascadeOnDelete();
            $table->foreignUlid("meal_id")->constrained()->cascadeOnDelete();
            $table->string("meal_name");
            $table->unsignedBigInteger("unit_price");
            $table->integer("quantity");
            $table->json("selected_options")->nullable(true);
            $table->unsignedBigInteger("total_price");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
