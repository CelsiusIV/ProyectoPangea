<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TypeClass;

class TypeClassesSeeder extends Seeder
{

    public function run(): void
    {
        TypeClass::create([
            'className' => 'Mensual',
            'classLimit' => 4,
            'price' => 70.00,

        ]);

        TypeClass::create([
            'className' => 'DiaSuelto',
            'classLimit' => 1,
            'price' => 20.00,
        ]);

        TypeClass::create([
            'className' => 'CursoFinde',
            'classLimit' => 1,
            'price' => 100.00,
        ]);

        TypeClass::create([
            'className' => 'Prueba',
            'classLimit' => 1,
            'price' => 0,
        ]);
    }
}
