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
        Schema::create('meals', function (Blueprint $table) {
            $table->ulid("id")->primary();
            $table->foreignUlid("restaurant_id")->constrained()->cascadeOnDelete();
            $table->foreignUlid("category_id")->constrained()->cascadeOnDelete();
            $table->string("name");
            $table->text("description")->nullable(true);
            $table->unsignedBigInteger("price");
            $table->string("image_url")->nullable();
            $table->boolean("is_available")->default(true);
            $table->json("options")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meals');
    }
};
