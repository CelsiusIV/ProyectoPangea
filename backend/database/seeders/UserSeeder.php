<?php

namespace Database\Seeders;

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
        $admin=User::create([
            'first_name' => 'Admin',
            'last_name' => 'User',
            'phone'=>'123456789',
            'email' => 'admin@test.com',
            'is_active' => true,
            'password' => Hash::make('password'),
        ]);

        $admin->assignRole('admin');
        
        
        $profesor=User::create([
            'first_name' => 'Celia',
            'last_name' => 'Serrano',
            'phone'=>'12342354289',
            'email' => 'celia@test.com',
            'is_active' => true,
            'password' => Hash::make('password'),
        ]);

        $profesor->assignRole('profesor'); 

        $alumno=User::create([
            'first_name' => 'Marina',
            'last_name' => 'Perez',
            'phone'=>'4565354289',
            'email' => 'marina@test.com',
            'is_active' => true,
            'password' => Hash::make('password'),
        ]);

        $alumno->assignRole('alumno'); 
    }
}
