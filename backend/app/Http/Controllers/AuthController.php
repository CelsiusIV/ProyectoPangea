<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\BaseController as BaseController;
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

        return $this->sendResponse([
            'name' => $user->first_name,
            'email' => $user->email,
        ], 'Inicio de sesión exitoso.');
    }

    public function logout()
    {
        Auth::user()->tokens->each(function ($token) {
            $token->forceDelete();
        });
        $response = [
            'status' => 'success',
            'code' => 200,
            'message' => 'Conexión exitosa',
            'resultado' => [
                'status' => 'success',
                'code' => 200,
                'message' => 'Sesión finalizada.',
            ]
        ];
        return response()->json($response, 200);
    }
}
