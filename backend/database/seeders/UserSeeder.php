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
            'email' => 'admin@pangea.com',
            'is_active' => true,
            'password' => Hash::make('4dm1np4ng34'),
        ]);

        $admin->assignRole('admin');
        
        
        $profesor1=User::create([
            'first_name' => 'Lucia',
            'last_name' => 'Sanchez',
            'phone'=>'654821563',
            'email' => 'lucia@pangea.com',
            'is_active' => true,
            'password' => Hash::make('pr0f31p4ng34'),
        ]);

        $profesor2=User::create([
            'first_name' => 'Martina',
            'last_name' => 'Rodriguez',
            'phone'=>'625588899',
            'email' => 'martina@pangea.com',
            'is_active' => true,
            'password' => Hash::make('pr0f32p4ng3a'),
        ]);

        $profesor1->assignRole('profesor'); 
        $profesor2->assignRole('profesor'); 

        $alumno1=User::create([
            'first_name' => 'Marina',
            'last_name' => 'Perez',
            'phone'=>'699831452',
            'email' => 'marina@test.com',
            'is_active' => true,
            'password' => Hash::make('password3'),
        ]);

          $alumno2=User::create([
            'first_name' => 'Sergio',
            'last_name' => 'Castillo',
            'phone'=>'658841253',
            'email' => 'sergio@test.com',
            'is_active' => true,
            'password' => Hash::make('password4'),
        ]);

          $alumno3=User::create([
            'first_name' => 'Cristina',
            'last_name' => 'Aguilar',
            'phone'=>'664789325',
            'email' => 'cristina@test.com',
            'is_active' => true,
            'password' => Hash::make('password5'),
        ]);

          $alumno4=User::create([
            'first_name' => 'Anabel',
            'last_name' => 'Mancilla',
            'phone'=>'693256714',
            'email' => 'anabel@test.com',
            'is_active' => true,
            'password' => Hash::make('password6'),
        ]);

          $alumno5=User::create([
            'first_name' => 'Marta',
            'last_name' => 'Serrano',
            'phone'=>'625874932',
            'email' => 'marta@test.com',
            'is_active' => true,
            'password' => Hash::make('password7'),
        ]);

        $alumno1->assignRole('alumno'); 
        $alumno2->assignRole('alumno'); 
        $alumno3->assignRole('alumno'); 
        $alumno4->assignRole('alumno'); 
        $alumno5->assignRole('alumno'); 

        $registrado1=User::create([
            'first_name' => 'Freya',
            'last_name' => 'Lozano',
            'phone'=>'621964232',
            'email' => 'freya@test.com',
            'is_active' => true,
            'password' => Hash::make('password8'),
        ]);

        $registrado1->assignRole('registrado'); 
    }
}
