<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaymentIntegrationTest extends TestCase
{
    use RefreshDatabase;
    protected $seed = true; //Lanzamos seeders

    public function test_payment_create(): void
    {
        $datos = [
            'user_id' => 1,
            'class_type_id' => 1,
            'paymentDate' => '2025-05-05',
            'availableClasses' => 4
        ];
        // Simulamos login con admin
        $loginResponse = $this->postJson('/api/login', [
            'email' => 'admin@pangea.com',
            'password' => '4dm1np4ng34'
        ]);

        $token = $loginResponse->json('token');
        $response = $this->withHeader('Authorization', "Bearer $token")->postJson('/api/payments', $datos);

        $response->assertStatus(200);
    }

    public function test_payment_list(): void
    {
        // Simulamos login con admin
        $loginResponse = $this->postJson('/api/login', [
            'email' => 'admin@pangea.com',
            'password' => '4dm1np4ng34'
        ]);

        $token = $loginResponse->json('token');
        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/payments');
        $response->assertStatus(200)->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'user_id',
                    'class_type_id',
                    'paymentDate',
                    'availableClasses'
                ]
            ]
        ]);
    }

    public function test_user_payments(): void
    {
        /** @var \Illuminate\Contracts\Auth\Authenticatable $admin */
        $admin = \App\Models\User::factory()->create();
        $admin->assignRole('admin');

        \App\Models\Payment::create([
            'user_id' => $admin->id,
            'class_type_id' => 1,
            'availableClasses' => 5,
            'paymentDate' => now()
        ]);
        \App\Models\Payment::create([
            'user_id' => $admin->id,
            'class_type_id' => 2,
            'availableClasses' => 4,
            'paymentDate' => now()
        ]);

        $response = $this->actingAs($admin)->getJson('/api/users/'. $admin->id .'/payments');
        $response->assertStatus(200)->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'paymentDate',
                    'availableClasses'
                ]
            ]
        ]);
    }
}
