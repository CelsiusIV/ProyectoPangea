<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TypeClasses;

class TypeClassesSeeder extends Seeder
{

    public function run(): void
    {
        TypeClasses::create([
            'className' => 'Mensual',
            'classLimit' => 4,
            'price' => 70.00,

        ]);

        TypeClasses::create([
            'className' => 'DiaSuelto',
            'classLimit' => 1,
            'price' => 20.00,
        ]);

        TypeClasses::create([
            'className' => 'CursoFinde',
            'classLimit' => 1,
            'price' => 100.00,
        ]);

        TypeClasses::create([
            'className' => 'Prueba',
            'classLimit' => 1,
            'price' => 0,
        ]);
    }
}
