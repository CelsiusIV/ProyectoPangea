<?php

namespace Tests\Unit;

use App\Http\Requests\ClassTypeRequest;
use App\Models\ClassType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Validator;
use Tests\TestCase;

class ClassTypeValidationTest extends TestCase
{
    use RefreshDatabase;

    // Funcion auxiliar para la validacion de datos
    private function validarDatos(array $datos)
    {
        $request = new ClassTypeRequest();
        return Validator::make($datos, $request->rules());
    }


    // Test1: Clase con datos correctos
    public function test_creacion_valida_de_clase()
    {
        $datos = ['className' => 'torno', 'classLimit' => 5, 'price' => 10, 'is_available'=>true];

        // Comprueba que no falla
        $this->assertFalse($this->validarDatos($datos)->fails());
        // Crea el tipo de clase
        $classType = ClassType::create($datos);
        $this->assertDatabaseHas('class_types', ['id' => $classType->id]); 
    }

    // Test 2: ClassLimit menor que 1
    public function test_error_classLimit_menor1()
    {
        $datos = ['className' => 'torno 2', 'classLimit' => -2, 'price' => 10, 'is_available'=>true];
        $validator = $this->validarDatos($datos); //Valida con el ClassTypeRequest
        $this->assertTrue($validator->fails()); // Comprueba que falla
        $this->assertArrayHasKey('classLimit', $validator->errors()->toArray());  // Falla por el campo classLimit
    }

    // Test 3: ClassLimit=0
    public function test_error_classLimit_0()
    {
        $datos = ['className' => 'torno 2', 'classLimit' => 0, 'price' =>  10, 'is_available'=>true];
        $validator = $this->validarDatos($datos); //Valida con el ClassTypeRequest
        $this->assertTrue($validator->fails()); // Comprueba que falla
        $this->assertArrayHasKey('classLimit', $validator->errors()->toArray());  // Falla por el campo classLimit
    }

    // Test 4: Price menor que 0
    public function test_error_price_negativo()
    {
        $datos = ['className' => 'torno 2', 'classLimit' => 10, 'price' => -5, 'is_available'=>true];

        $validator = $this->validarDatos($datos); //Valida con el ClassTypeRequest
        $this->assertTrue($validator->fails()); // Comprueba que falla
        $this->assertArrayHasKey('price', $validator->errors()->toArray()); // Falla por el campo price
    }
}
