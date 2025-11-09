<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'username' => fake()->unique()->userName(), // Genera un nombre de usuario único
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'birth_year' => fake()->numberBetween(1970, 2005),
            'phone' => fake()->phoneNumber(),
            'email' => fake()->unique()->safeEmail(),
            'is_active' => fake()->boolean(),
            // Clave 'password' (la que Laravel espera, hasheada)
            'password' => static::$password ??= Hash::make('password'),
        ];
    }
}
