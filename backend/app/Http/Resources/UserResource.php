<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $user = Auth::user();
        $role = $this->roles->first();
        
        if ($user->hasRole('alumno') && $user->id !== $this->id) {
            return [
                'first_name' => $this->first_name,
                'last_name' => $this->last_name,
                'role' => $role ? [
                    'role_name' => $role->name,
                ] : null,
            ];
        }

        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'birth_date' => $this->birth_date,
            'phone' => $this->phone,
            'email' => $this->email,
            'is_active' => $this->is_active,
            'role' => $role ? [
                'id' => $role->id,
                'role_name' => $role->name,
            ] : null,
        ];
    }
}
