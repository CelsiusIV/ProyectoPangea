<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingClassController;
use App\Http\Controllers\ClassController;
use App\Http\Controllers\ClassTypeController;
use App\Http\Controllers\PaymentsController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// LOGIN y LOGOUT
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
Route::middleware('auth:sanctum')->get('/session-check', function () {
    return response()->json([
        'authenticated' => true
    ]);
});
// ACCESOS 
// Se permite crear usuario a cualquiera, para permitir el registro
Route::post('/users', [UserController::class, 'store']);

// Accesos que requieren autenticacion
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/users/{user_id}/payments', [PaymentsController::class, 'userPayment']);
    Route::get('/classes/{class_id}/bookings', [BookingClassController::class, 'classBooking']);

    // Usuarios
    Route::apiResource('users', UserController::class)
        ->except(['store'])
        ->middleware('role:admin|profesor|alumno');
    
    // Clases
    Route::apiResource('classes', ClassController::class)
        ->only(['index', 'show'])
        ->middleware('role:alumno|admin|profesor|registrado');
    Route::apiResource('classes', ClassController::class)
        ->except(['index', 'show'])
        ->middleware('role:admin|profesor');

    // Tipos de clase
    Route::apiResource('class_types', ClassTypeController::class)
        ->only(['index', 'show'])
        ->middleware('role:profesor|alumno|admin|registrado');

    Route::apiResource('class_types', ClassTypeController::class)
        ->except(['index', 'show'])
        ->middleware('role:admin');

    // Roles
    Route::apiResource('roles', RoleController::class)
        ->middleware('role:admin|profesor');

    // Pagos
    Route::apiResource('payments', PaymentsController::class);

    // Reservas
    Route::apiResource('booking', BookingClassController::class)
        ->middleware('role:admin|profesor|alumno');
});
