<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class BookingClassIntegrationTest extends TestCase
{
    use RefreshDatabase;
    protected $seed = true; //Lanzamos seeders

    public function test_bookingClass_create(): void
    {
        /** @var \Illuminate\Contracts\Auth\Authenticatable $admin */
        $admin = \App\Models\User::factory()->create();
        $admin->assignRole('admin');

        $class = \App\Models\Classes::create([
            'beginDate' => '2025-05-10T20:30',
            'endDate' => '2025-05-10T22:30',
            'maxStudents' => 10,
            'class_type_id' => 1
        ]);

        \App\Models\Payment::create([
            'user_id' => $admin->id,
            'class_type_id' => 1,
            'availableClasses' => 5,
            'paymentDate' => now()
        ]);

        $datos = [
            'class_id' => $class->id,
            'user_id' => $admin->id,
            'attendance' => false
        ];
        $response = $this->actingAs($admin)->postJson('/api/booking', $datos);

        $response->assertStatus(200);
    }

    public function test_booking_list(): void
    {
        // Simulamos login con admin
        $loginResponse = $this->postJson('/api/login', [
            'email' => 'admin@pangea.com',
            'password' => '4dm1np4ng34'
        ]);

        $token = $loginResponse->json('token');
        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/booking');
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

    public function test_get_bookingClass(): void
    {
        $class = \App\Models\Classes::create([
            'beginDate' => '2025-05-10T20:30',
            'endDate'      => '2025-05-10T22:30',
            'maxStudents'      => 10,
            'class_type_id'   => 1
        ]);
        $bookingClass = \App\Models\BookingClass::create([
            'class_id' => $class->id,
            'user_id' => 1,
            'attendance' => true
        ]);
        // Simulamos login con admin
        $loginResponse = $this->postJson('/api/login', [
            'email' => 'admin@pangea.com',
            'password' => '4dm1np4ng34'
        ]);

        $token = $loginResponse->json('token');
        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/booking/' . $bookingClass->id);
        $response->assertStatus(200)->assertJsonStructure([
            'data' => [
                'id'
            ]
        ]);
    }

    public function test_update_bookingClass(): void
    {
        /** @var \Illuminate\Contracts\Auth\Authenticatable $admin */
        $admin = \App\Models\User::factory()->create();
        $admin->assignRole('admin');
        $class = \App\Models\Classes::create([
            'beginDate' => '2025-05-10T20:30',
            'endDate'      => '2025-05-10T22:30',
            'maxStudents'      => 10,
            'class_type_id'   => 1
        ]);
        $bookingClass = \App\Models\BookingClass::create([
            'class_id' => $class->id,
            'user_id' => 1,
            'attendance' => true
        ]);

        $datos = [
            'class_id' => $class->id,
            'user_id' => 1,
            'attendance' => false
        ];
        $response = $this->actingAs($admin)->putJson('/api/booking/' . $bookingClass->id, $datos);
        $response->assertStatus(200);
    }

    public function test_update_bookingClass_error_unauthorized(): void
    {
        /** @var \Illuminate\Contracts\Auth\Authenticatable $alumno */
        $alumno = \App\Models\User::factory()->create();
        $alumno->assignRole('alumno');
        $class = \App\Models\Classes::create([
            'beginDate' => '2025-05-10T20:30',
            'endDate'      => '2025-05-10T22:30',
            'maxStudents'      => 10,
            'class_type_id'   => 1
        ]);
        $bookingClass = \App\Models\BookingClass::create([
            'class_id' => $class->id,
            'user_id' => 1,
            'attendance' => true
        ]);

        $datos = [
            'class_id' => $class->id,
            'user_id' => 1,
            'attendance' => false
        ];
        $response = $this->actingAs($alumno)->putJson('/api/booking/' . $bookingClass->id, $datos);
        $response->assertStatus(403);
    }
    public function test_delete_bookingClass(): void
    {

        /** @var \Illuminate\Contracts\Auth\Authenticatable $admin */
        $admin = \App\Models\User::factory()->create();
        $admin->assignRole('admin');

        $class = \App\Models\Classes::create([
            'beginDate' => '2025-05-10T20:30',
            'endDate'      => '2025-05-10T22:30',
            'maxStudents'      => 10,
            'class_type_id'   => 1
        ]);
        \App\Models\Payment::create([
            'user_id' => $admin->id,
            'class_type_id' => 1,
            'availableClasses' => 5,
            'paymentDate' => now()
        ]);
        $bookingClass = \App\Models\BookingClass::create([
            'class_id' => $class->id,
            'user_id' => $admin->id,
            'attendance' => false
        ]);

        $response =  $this->actingAs($admin)->delete('/api/booking/' . $bookingClass->id);
        $response->assertStatus(200);
    }

}

