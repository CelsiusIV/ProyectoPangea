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
            'username' => 'required|string|unique:users',
            'password' => 'required|string|min:8',
            'first_name' => 'required|string',
            'last_name' => 'string',
            'birth_date' => Rule::date()->format('Y-m-d'),
            'email' => 'required|email:rfc,dns',
            'phone' => 'required|string'
        ];
    }
}
