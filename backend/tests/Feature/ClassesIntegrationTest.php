<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ClassesIntegrationTest extends TestCase
{
    use RefreshDatabase;
    protected $seed = true; //Lanzamos seeders

    public function test_class_create(): void
    {
        $datos = [
            'beginDate' => '2025-05-10T20:30',
            'endDate'      => '2025-05-10T22:30',
            'maxStudents'      => 10,
            'class_type_id'   => 1
        ];
        // Simulamos login con admin
        $loginResponse = $this->postJson('/api/login', [
            'email' => 'admin@pangea.com',
            'password' => '4dm1np4ng34'
        ]);

        $token = $loginResponse->json('token');
        $response = $this->withHeader('Authorization', "Bearer $token")->postJson('/api/classes', $datos);

        $response->assertStatus(200);
    }

    public function test_classes_list(): void
    {
        // Simulamos login con admin
        $loginResponse = $this->postJson('/api/login', [
            'email' => 'admin@pangea.com',
            'password' => '4dm1np4ng34'
        ]);

        $token = $loginResponse->json('token');
        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/classes');
        $response->assertStatus(200)->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'beginDate',
                    'endDate',
                    'maxStudents',
                    'class_type_id'
                ]
            ]
        ]);
    }

    public function test_get_class(): void
    {
        // clase de prueba
        $class = \App\Models\Classes::create([
            'beginDate' => '2025-05-10T20:30',
            'endDate'      => '2025-05-10T22:30',
            'maxStudents'      => 10,
            'class_type_id'   => 1
        ]);
        // Simulamos login con admin
        $loginResponse = $this->postJson('/api/login', [
            'email' => 'admin@pangea.com',
            'password' => '4dm1np4ng34'
        ]);

        $token = $loginResponse->json('token');
        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/classes/' . $class->id);
        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'beginDate',
                    'endDate',
                    'maxStudents'
                ]
            ]);
    }
    public function test_class_update(): void
    {

        /** @var \Illuminate\Contracts\Auth\Authenticatable $admin */
        $admin = \App\Models\User::factory()->create();
        $admin->assignRole('admin');
        // clase de prueba
        $class = \App\Models\Classes::create([
            'beginDate' => '2025-05-10T20:30',
            'endDate'      => '2025-05-10T22:30',
            'maxStudents'      => 10,
            'class_type_id'   => 1
        ]);
        $datos = [
            'beginDate' => '2025-05-10T15:30',
            'endDate'      => '2025-05-10T18:30',
            'maxStudents'      => 5,
            'class_type_id'   => 1
        ];

        $response = $this->actingAs($admin)->putJson('/api/classes/' . $class->id, $datos);

        $response->assertStatus(200);
    }

    public function test_class_update_error_unauthorized(): void
    {
        /** @var \Illuminate\Contracts\Auth\Authenticatable $admin */
        $admin = \App\Models\User::factory()->create();
        $admin->assignRole('alumno');
        // clase de prueba
        $class = \App\Models\Classes::create([
            'beginDate' => '2025-05-10T20:30',
            'endDate'      => '2025-05-10T22:30',
            'maxStudents'      => 10,
            'class_type_id'   => 1
        ]);
        $datos = [
            'beginDate' => '2025-05-10T15:30',
            'endDate'      => '2025-05-10T18:30',
            'maxStudents'      => 5,
            'class_type_id'   => 1
        ];

        $response = $this->actingAs($admin)->putJson('/api/classes/' . $class->id, $datos);

        $response->assertStatus(403);
    }


    public function test_delete_class(): void
    {
        // clase de prueba
        $class = \App\Models\Classes::create([
            'beginDate' => '2025-05-10T20:30',
            'endDate'      => '2025-05-10T22:30',
            'maxStudents'      => 10,
            'class_type_id'   => 1
        ]);
        // Simulamos login con admin
        $loginResponse = $this->postJson('/api/login', [
            'email' => 'admin@pangea.com',
            'password' => '4dm1np4ng34'
        ]);

        $token = $loginResponse->json('token');
        $response = $this->withHeader('Authorization', "Bearer $token")
            ->delete('/api/classes/' . $class->id);
        $response->assertStatus(200);
    }
}
