<?php

use App\Http\Controllers\BookingClassController;
use App\Http\Controllers\ClassController;
use App\Http\Controllers\ClassTypeController;
use App\Http\Controllers\PaymentsController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
/* 
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum'); */

Route::post('/tokens/create', function (Request $request) {
    $token = $request->user()->createToken($request->token_name);
    return ['token' => $token->plainTextToken];
});

Route::apiResource('users', UserController::class)->middleware('auth:sanctum');;
Route::apiResource('roles', RoleController::class);
Route::apiResource('payments', PaymentsController::class);
Route::apiResource('classes', ClassController::class);
Route::apiResource('booking', BookingClassController::class);
Route::apiResource('class_types', ClassTypeController::class);
