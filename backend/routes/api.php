<?php

use App\Http\Controllers\BookingClassController;
use App\Http\Controllers\ClassesController;
use App\Http\Controllers\PaymentsController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\TypeClassController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
/* 
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum'); */

Route::apiResource('users',UserController::class);
Route::apiResource('roles',RoleController::class);
Route::apiResource('payments',PaymentsController::class);
Route::apiResource('classes',ClassesController::class);
Route::apiResource('booking',BookingClassController::class);
Route::apiResource('typeclass',TypeClassController::class);