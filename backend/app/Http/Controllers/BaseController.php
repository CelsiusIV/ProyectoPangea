<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;

class BaseController extends Controller
{
    /**
     * Enviar respuesta de éxito.
     *
     * @param mixed  $data      Datos de la respuesta
     * @param string $message   Mensaje a mostrar
     * @param int    $code      Código de respuesta HTTP (por defecto 200)
     * @return JsonResponse
     */
    public function sendResponse($data, $message, $code = 200): JsonResponse
    {
        return response()->json([
            'status'  => 'success',
            'code'    => 200,
            'message' => 'Conexión exitosa',
            'resultado' => [
                'status'  => 'success',
                'code'    => $code,
                'message' => $message,
                'data'    => $data,
            ],
        ], 200);
    }

    /**
     * Enviar respuesta de error.
     *
     * @param string $message        Mensaje de error
     * @param array  $errorMessages  Errores adicionales (opcional)
     * @param int    $code           Código de error (por defecto 400)
     * @return JsonResponse
     */
    public function sendError($message, $errorMessages, $code): JsonResponse
    {
        return response()->json([
            'status'  => 'danger',
            'code'    => $code,
            'message' => is_array($errorMessages) ? implode(' ', $errorMessages) : $message,
        ], $code);
    }
}