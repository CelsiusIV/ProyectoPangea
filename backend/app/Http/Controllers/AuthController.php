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
        if (!Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            return $this->sendError('Credenciales incorrectas.', ['El email o la contraseña son incorrectos.'], 401);
        }
        /** @var User $user */
        $user = Auth::user();
        if ($user->is_active !== 1) {
            return $this->sendError('Acceso denegado.', ['Su cuenta no está activa. Contacte al administrador.'], 403);
        }
        //$fullToken = $user->createToken('pangea')->plainTextToken;
        //$token = explode('|', $fullToken)[1];
        $token = $user->createToken('pangea')->plainTextToken;


        $expiresAt = now()->addHour();
        $user->tokens()->latest()->first()->update([
            'expires_at' => $expiresAt,
        ]);
        $data = [
            'token' => $token,
            'expires_at' => $expiresAt->toDateTimeString(),
            'name' => $user->first_name,
            'email' => $user->email
        ];

        return $this->sendResponse($data, 'Inicio de sesión exitoso.');
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
