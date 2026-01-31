<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\BaseController as BaseController;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends BaseController
{
    public function login(Request $request): JsonResponse
    {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return $this->sendError('Credenciales incorrectas.', [], 401);
        }

        $user = Auth::user();

        if ($user->is_active !== 1) {
            return $this->sendError('Acceso denegado.', [], 403);
        }

        $request->session()->regenerate();

        return $this->sendResponse(
            new UserResource($user),
            'Inicio de sesión exitoso.'
        );
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        return $this->sendResponse(
            [],
            'Sesión cerrada correctamente.'
        );
    }
}
