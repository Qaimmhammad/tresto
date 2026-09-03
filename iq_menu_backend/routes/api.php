<?php

use App\Http\Controllers\BranchController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MealController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\TableController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;




Route::get("/restaurant/slug" , [RestaurantController::class, "getRestaurantBySlug"]);
Route::get("/restaurant/public-data" , [RestaurantController::class , "getPublicData"]);

Route::post('/login', [UserController::class, 'login'])
    ->name('login');

Route::middleware('auth:sanctum')->group(function () {

    Route::get("/dashboard/tables" , [TableController::class, "index"]);

    Route::post('/logout', [UserController::class, 'logout'])
        ->name('logout');

    Route::post('tables/bulk' , [TableController::class, "setCount"]);

    Route::get('/user', function (Request $request) {
        return $request->user();
    })->name('user');

    Route::post("/users" , [UserController::class , 'store']);

    Route::get('/dashboard/summary', [DashboardController::class, 'summary']);

    Route::get("/orders/get", [OrderController::class , 'getOrders']);

    Route::get('/users/all', [UserController::class, 'index']);

    Route::delete('users/{user}', [UserController::class, 'destroy']);
    Route::put('users/{user}', [UserController::class, 'update']);
});

Route::post('/restaurant', [RestaurantController::class, 'store'])
    ->name('restaurant.store');

Route::middleware([
    'auth:sanctum',
    'role:admin',
])->group(function () {

    Route::get('/restaurant', [RestaurantController::class, 'index'])
        ->name('restaurant.index');

    Route::get('/restaurant/{restaurant}', [RestaurantController::class, 'show'])
        ->name('restaurant.show');

    Route::put('/restaurant/{restaurant}', [RestaurantController::class, 'update'])
        ->name('restaurant.update');

    Route::delete('/restaurant/{restaurant}', [RestaurantController::class, 'destroy'])
        ->name('restaurant.destroy');

});

Route::middleware([
    'auth:sanctum',
    'role:admin,branch_manager',
])->group(function () {

    Route::apiResource('categories', CategoryController::class);
});

Route::get(
    '/t/{table}/menu',
    [TableController::class, 'resolveQr']
)->name('tables.menu');

Route::middleware([
    'auth:sanctum',
    'role:admin,branch_manager,employee',
])->group(function () {

    Route::get(
        '/branches/{branchId}/tables',
        [TableController::class, 'index']
    )->name('tables.index');

    Route::post(
        '/branches/{branchId}/tables',
        [TableController::class, 'store']
    )->name('tables.store');

    Route::get(
        '/tables/{id}',
        [TableController::class, 'show']
    )->name('tables.show');

    Route::put(
        '/tables/{id}',
        [TableController::class, 'update']
    )->name('tables.update');

    Route::delete(
        '/tables/{id}',
        [TableController::class, 'destroy']
    )->name('tables.destroy');
});

Route::get(
    '/restaurant/{restaurant}/meals',
    [MealController::class, 'index']
)->name('meals.index');

Route::middleware('auth:sanctum')->group(function () {

    Route::get(
        '/branches',
        [BranchController::class, 'index']
    )->name('branches.index');

    Route::get(
        '/meals/all',
        [MealController::class , "index"]
    );

    Route::post(
        '/branches',
        [BranchController::class, 'store']
    )->name('branches.store');

    Route::get(
        '/branches/{branch}',
        [BranchController::class, 'show']
    )->name('branches.show');

    Route::put(
        '/branches/{branch}',
        [BranchController::class, 'update']
    )->name('branches.update');

    Route::delete(
        '/branches/{branch}',
        [BranchController::class, 'destroy']
    )->name('branches.destroy');
});

Route::middleware('auth:sanctum')->group(function () {

    Route::post(
        '/meals',
        [MealController::class, 'store']
    )->name('meals.store');

    Route::put(
        '/meals/{meal}',
        [MealController::class, 'update']
    )->name('meals.update');

    Route::delete(
        '/meals/{meal}',
        [MealController::class, 'destroy']
    )->name('meals.destroy');
});

Route::post(
    '/t/{table}/orders',
    [OrderController::class, 'storeDineIn']
)->name('orders.dine-in');

Route::post(
    'branche/orders/{branchId}',
    [OrderController::class, 'store']
)->name('orders.store');
