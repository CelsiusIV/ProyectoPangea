<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserIntegrationTest extends TestCase
{
    use RefreshDatabase;
    protected $seed = true; //Lanzamos seeders

    public function test_user_create(): void
    {
        $datos = [
            'first_name' => 'Juan',
            'email'      => 'test34@test.com',
            'phone'      => '654789635',
            'password'   => 'Password123!',
            'is_active'  => true,
        ];
        $response = $this->postJson('/api/users', $datos);

        $response->assertStatus(200);
    }
    public function test_user_create_error_email(): void
    {
        $datos = [
            'first_name' => 'Juan',
            'phone'      => '654789635',
            'password'   => 'Password123!',
            'is_active'  => true,
        ];
        $response = $this->postJson('/api/users', $datos);

        $response->assertStatus(422);
    }
    public function test_user_update(): void
    {
        /** @var \Illuminate\Contracts\Auth\Authenticatable $admin */
        $admin = \App\Models\User::factory()->create();
        $admin->assignRole('admin');
        // Usuario de prueba
        $user = \App\Models\User::create([
            'first_name' => 'Juan',
            'email'      => 'test34@test.com',
            'phone'      => '654789635',
            'password'   => 'Password123!',
            'is_active'  => true
        ]);
        $user->assignRole('alumno');
        $datos = [
            'first_name' => 'Juan Alberto',
            'email'      => 'test34@test.com',
            'phone'      => '654789855',
            'is_active'  => true
        ];

        $response = $this->actingAs($admin)->putJson('/api/users/' . $user->id, $datos);

        $response->assertStatus(200);
    }

    public function test_user_list(): void
    {
        // Simulamos login con admin
        $loginResponse = $this->postJson('/api/login', [
            'email' => 'admin@pangea.com',
            'password' => '4dm1np4ng34'
        ]);

        $token = $loginResponse->json('token');
        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/users');
        $response->assertStatus(200)->assertJsonStructure([
            'data' => [
                '*' => [ 
                    'id',
                    'first_name',
                    'last_name',
                    'email',
                    'phone',
                    'is_active'
                ]
            ]
        ]);
    }
        public function test_user_list_error_without_login(): void
    {

        $response = $this->getJson('/api/users');
        $response->assertStatus(401);
    }

    public function test_get_user(): void
    {
        // Simulamos login con admin
        $loginResponse = $this->postJson('/api/login', [
            'email' => 'admin@pangea.com',
            'password' => '4dm1np4ng34'
        ]);

        $token = $loginResponse->json('token');
        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/users/1');
        $response->assertStatus(200)->assertJsonStructure([
            'data' => [
                'id',
                'first_name',
                'email',
                'phone',
                'is_active',
            ]
        ]);
    }

    public function test_delete_user(): void
    {
        // Simulamos login con admin
        $loginResponse = $this->postJson('/api/login', [
            'email' => 'admin@pangea.com',
            'password' => '4dm1np4ng34'
        ]);

        $token = $loginResponse->json('token');
        $response = $this->withHeader('Authorization', "Bearer $token")
            ->delete('/api/users/8');
        $response->assertStatus(200);
    }
}
