<?php

namespace Tests\Feature;

use App\Http\Requests\UserRequest;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Validator;

class UsuarioValidationTest extends TestCase
{
    use RefreshDatabase;

    // Funcion auxiliar para la validacion de datos
    private function validarDatos(array $datos)
    {
        $request = new UserRequest();
        return Validator::make($datos, $request->rules());
    }


    // Test1: Usuario con datos correctos
    public function test_creacion_valida_de_usuario()
    {
        $datos = [
            'first_name' => 'Ana',
            'last_name' => 'Perez',
            'email' => 'ana@test.com',
            'phone' => '123456789',
            'password' => 'Ceramica2026',
            'is_active' => true
        ];

        // Comprueba que no falla
        $this->assertFalse($this->validarDatos($datos)->fails());
        // Crea el usuario
        User::create($datos);
        $this->assertDatabaseHas('users', ['email' => 'ana@test.com']); // El usuario se ha creado en la base de datos
    }

    // Test 2: Formato de email erroneo
    public function test_error_email_formato()
    {
        $datos = ['email' => 'correosinformato', 'first_name' => 'Juan', 'phone' => '111'];
        $validator = $this->validarDatos($datos); //Valida con el UserRequest
        $this->assertTrue($validator->fails()); // Comprueba que falla
        $this->assertArrayHasKey('email', $validator->errors()->toArray());  // Falla por el campo email
    }

    // Test 3: First_name demasiado largo
    public function test_error_nombre_muylargo()
    {
        $datos = ['email' => 'test@test.com', 'first_name' => 'Juan Alberto Manuel de todos los santos', 'phone' => '111666999'];

        $validator = $this->validarDatos($datos); //Valida con el UserRequest
        $this->assertTrue($validator->fails()); // Comprueba que falla
        $this->assertArrayHasKey('first_name', $validator->errors()->toArray()); // Falla por el campo first_name
    }

    // Test 4: Contraseña demasiado corta
    public function test_error_password_corta()
    {
        $datos = [
            'first_name' => 'Ana',
            'last_name' => 'Perez',
            'email' => 'ana2@test.com',
            'phone' => '123456789',
            'password' => 'Cera',
            'is_active' => true
        ];

        $validator = $this->validarDatos($datos); //Valida con el UserRequest
        $this->assertTrue($validator->fails()); // Comprueba que falla
        $this->assertArrayHasKey('password', $validator->errors()->toArray()); // Falla por el campo password
    }
}
