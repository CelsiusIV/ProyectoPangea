<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ClassTypeIntegrationTest extends TestCase
{
    use RefreshDatabase;
    protected $seed = true; //Lanzamos seeders

    public function test_classType_create(): void
    {
        $datos = [
            'className' => 'Torno',
            'classLimit'      => 4,
            'price'      => 30,
            'is_available'  => true
        ];
        // Simulamos login con admin
        $loginResponse = $this->postJson('/api/login', [
            'email' => 'admin@pangea.com',
            'password' => '4dm1np4ng34'
        ]);
        $token = $loginResponse->json('token');
        $response =  $this->withHeader('Authorization', "Bearer $token")->postJson('/api/class_types', $datos);

        $response->assertStatus(200);
    }

    public function test_classType_create_error_without_login(): void
    {
        $datos = [
            'className' => 'Torno',
            'classLimit'      => 4,
            'price'      => 30,
            'is_available'  => true
        ];
        $response =  $this->postJson('/api/class_types', $datos);

        $response->assertStatus(401);
    }

    public function test_classTypes_list(): void
    {
        // Simulamos login con admin
        $loginResponse = $this->postJson('/api/login', [
            'email' => 'admin@pangea.com',
            'password' => '4dm1np4ng34'
        ]);

        $token = $loginResponse->json('token');
        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/class_types');
        $response->assertStatus(200)->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'className',
                    'classLimit',
                    'price',
                    'is_available',
                ]
            ]
        ]);
    }

    public function test_get_classType(): void
    {
        // Simulamos login con admin
        $loginResponse = $this->postJson('/api/login', [
            'email' => 'admin@pangea.com',
            'password' => '4dm1np4ng34'
        ]);

        $token = $loginResponse->json('token');
        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/class_types/1');
        $response->assertStatus(200)->assertJsonStructure([
            'data' => [
                'id',
                'className',
                'classLimit',
                'price',
                'is_available',
            ]
        ]);
    }
    public function test_get_classType_error_doesnt_exists(): void
    {
        // Simulamos login con admin
        $loginResponse = $this->postJson('/api/login', [
            'email' => 'admin@pangea.com',
            'password' => '4dm1np4ng34'
        ]);

        $token = $loginResponse->json('token');
        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/class_types/58');
        $response->assertStatus(404);
    }

    public function test_delete_classType(): void
    {
        // Simulamos login con admin
        $loginResponse = $this->postJson('/api/login', [
            'email' => 'admin@pangea.com',
            'password' => '4dm1np4ng34'
        ]);

        $token = $loginResponse->json('token');
        $response = $this->withHeader('Authorization', "Bearer $token")
            ->delete('/api/class_types/4');
        $response->assertStatus(200);
    }
}
