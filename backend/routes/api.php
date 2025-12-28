<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingClassController;
use App\Http\Controllers\ClassController;
use App\Http\Controllers\ClassTypeController;
use App\Http\Controllers\PaymentsController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\PersonalAccessToken;

// LOGIN y LOGOUT
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

// ACCESOS 
Route::middleware(['auth:sanctum'])->group(function () {
Route::apiResource('users', UserController::class)
    ->middleware('role:admin|profesor');
    Route::apiResource('users', UserController::class)->middleware('role:admin|profesor');
    Route::apiResource('users', UserController::class)->only('show')->middleware('role:alumno');
    Route::apiResource('roles', RoleController::class)->middleware('role:admin|profesor');
    Route::apiResource('payments', PaymentsController::class)->middleware('role:admin|profesor');;
    Route::apiResource('classes', ClassController::class)->middleware('role:admin|profesor');
    Route::apiResource('classes', ClassController::class)->only('index', 'show')->middleware('role:alumno');
    Route::apiResource('booking', BookingClassController::class)->middleware('role:admin|profesor|alumno');
    Route::apiResource('class_types', ClassTypeController::class)->middleware('role:admin');
    Route::apiResource('class_types', ClassTypeController::class)->only('index', 'show')->middleware('role:profesor|alumno');
});
