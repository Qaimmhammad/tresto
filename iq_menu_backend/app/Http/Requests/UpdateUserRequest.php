<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        $userRole = $this->user()->role;

        if ($userRole === 'admin') {
            return true;
        }

        if ($userRole === 'branch_manager') {
            $user = $this->route('id');

            return $user !== null;
        }

        return false;
    }

    public function rules(): array
    {
        $currentUser = $this->user();

        // Admin can update any user in his restaurant.
        if ($currentUser->role === 'admin') {

            $userId = $this->route('id');

            return [
                'name' => [
                    'sometimes',
                    'string',
                    'min:3',
                    'max:50',
                ],

                'user_name' => [
                    'sometimes',
                    'string',
                    'min:3',
                    'max:50',
                    Rule::unique('users', 'user_name')
                        ->ignore($userId),
                ],

                'password' => [
                    'sometimes',
                    'string',
                    'min:8',
                ],

                'role' => [
                    'sometimes',
                    Rule::in([
                        'admin',
                        'branch_manager',
                        'employee',
                    ]),
                ],

                'branch_id' => [
                    'nullable',
                    'ulid',
                    'exists:branches,id',
                ],
            ];
        }

        // Branch managers can only update employee data.
        if ($currentUser->role === 'branch_manager') {

            return [
                'name' => [
                    'sometimes',
                    'string',
                    'min:3',
                    'max:50',
                ],

                'user_name' => [
                    'sometimes',
                    'string',
                    'min:3',
                    'max:50',
                    Rule::unique('users', 'user_name')
                        ->ignore($this->route('id')),
                ],

                'password' => [
                    'sometimes',
                    'string',
                    'min:8',
                ],
            ];
        }

        return [];
    }
}