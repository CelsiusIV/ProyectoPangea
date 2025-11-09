<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'username' => 'admin',
            'first_name' => 'Admin',
            'last_name' => 'User',
            'phone'=>'123456789',
            'email' => 'admin@test.com',
            'is_active' => true,
            'password' => Hash::make('password'), // La contraseña será 'password'
        ]);

        User::factory(5)->create();
    }
}
