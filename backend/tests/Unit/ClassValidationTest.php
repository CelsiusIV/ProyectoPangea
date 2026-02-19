<?php

namespace Tests\Unit;

use App\Http\Requests\ClassRequest;
use App\Models\Classes;
use App\Models\ClassType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Validator;
use Tests\TestCase;

class ClassValidationTest extends TestCase
{
    use RefreshDatabase;

    // Funcion auxiliar para la validacion de datos
    private function validarDatos(array $datos)
    {
        $request = new ClassRequest();
        return Validator::make($datos, $request->rules());
    }


    // Test1: Clase con datos correctos
    public function test_creacion_valida_de_clase()
    {
        $tipoDeClase = ClassType::create([
            'className' => 'Torno básico',
            'classLimit' => 10,
            'price' => 25.0,
            'is_available' => true
        ]);
        $datos = ['beginDate' => '2025-05-10T20:30', 'endDate' => '2025-05-10T22:30', 'maxStudents' => 10, 'class_type_id' => $tipoDeClase->id];

        // Comprueba que no falla
        $this->assertFalse($this->validarDatos($datos)->fails());
        // Crea la clase
        $class = Classes::create($datos);
        $this->assertDatabaseHas('classes', ['id' => $class->id]); 
    }

    // Test 2: Formato de beginDate erroneo
    public function test_error_beginDate_formato()
    {
        $datos = ['beginDate' => '10/05/2025T11:30', 'endDate' => '2025-05-10T22:30', 'maxStudents' => '12', 'class_type_id' => '1'];
        $validator = $this->validarDatos($datos); //Valida con el ClassRequest
        $this->assertTrue($validator->fails()); // Comprueba que falla
        $this->assertArrayHasKey('beginDate', $validator->errors()->toArray());  // Falla por el campo beginDate
    }

    // Test 3: MaxStudents negativo
    public function test_error_maxStudents_negativo()
    {
        $datos = ['beginDate' => '2025-05-10T15:30', 'endDate' => '2025-05-10T18:30', 'maxStudents' => '-3', 'class_type_id' => '1'];

        $validator = $this->validarDatos($datos); //Valida con el ClassRequest
        $this->assertTrue($validator->fails()); // Comprueba que falla
        $this->assertArrayHasKey('maxStudents', $validator->errors()->toArray()); // Falla por el campo maxStudents
    }

    // Test 4: MaxStudents mayor que 20
    public function test_error_maxStudents_mayor20()
    {
        $datos = ['beginDate' => '2025-05-10T15:30', 'endDate' => '2025-05-10T18:30', 'maxStudents' => '50', 'class_type_id' => '1'];

        $validator = $this->validarDatos($datos); //Valida con el ClassRequest
        $this->assertTrue($validator->fails()); // Comprueba que falla
        $this->assertArrayHasKey('maxStudents', $validator->errors()->toArray()); // Falla por el campo maxStudents
    }
}
