<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    // Mostrar el formulario de inicio de sesión autenticada
    public function mostrarFormularioLoginCSP() // Sustituye CSP por tus iniciales
    {
        return view('auth.login');
    }

    // Realizar el inicio de sesión autenticada
    public function loginCSP(Request $request) // Sustituye CSP por tus iniciales
    {
        // Validar los datos del formulario
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Se verifica email/password (true si ok)
        if (Auth::attempt($credentials)) {
            //Si ok--> se regenera sesión (se anota que está autenticado en la sesión).
            $request->session()->regenerate();
            //Redireccionamos a la página principal de la zona autenticada
            return redirect()->intended(route('zonaprivada'));
        }

        // Si la autenticación falla, volver al formulario con un error
        return back()->withErrors([
            'email' => 'El email o la contraseña no son válidos.',
        ])->onlyInput('email');
    }

    // Cerrar sesión autenticada
    public function logoutCSP(Request $request) // Sustituye CSP por tus iniciales
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect(route('zonapublica'));
    }
}
