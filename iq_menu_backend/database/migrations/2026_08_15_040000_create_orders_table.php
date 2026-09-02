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
        Schema::create('orders', function (Blueprint $table) {
            $table->ulid("id")->primary();
            $table->string("address")->nullable();
            $table->foreignUlid("restaurant_id")->constrained()->cascadeOnDelete();
            $table->foreignUlid("branch_id")->constrained()->cascadeOnDelete();
            $table->foreignUlid("table_id")->nullable()->constrained()->cascadeOnDelete();
            $table->string("customer_name");
            $table->string("customer_phone_number")->nullable();
            $table->text("description")->nullable();
            $table->string("order_type");
            $table->string("status");
            $table->unsignedBigInteger("total_price");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
