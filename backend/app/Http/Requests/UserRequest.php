<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'password' => 'nullable|string|min:8',
            'first_name' => 'required|string',
            'last_name' => 'nullable | string',
            'birth_date' => 'nullable | ' . Rule::date()->format('Y-m-d'),
            'is_active' => 'boolean',
            'email' => 'required', //|email:rfc,dns',
            'phone' => 'required|string',
            'role_id' => 'nullable|integer'
        ];
    }
}
