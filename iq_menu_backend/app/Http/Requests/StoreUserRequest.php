<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user_role = $this->user()->role;
        $role_to_add = $this->input("role") ; 

        if ($user_role === "admin" ){
            return true; 
        }
        if ($user_role === "branch_manager" && 
            $role_to_add === "employee"){
            return true ;
        }
        return false ;

    }

    public function rules(): array
    {
        $user = $this->user();

        // Admin can create any user type
        if ($user->role === 'admin') {
            return [
                'name' => [
                    'required',
                    'string',
                    'min:3',
                    'max:50',
                ],

                'user_name' => [
                    'required',
                    'string',
                    'min:3',
                    'max:50',
                    'unique:users,user_name',
                ],

                'password' => [
                    'required',
                    'string',
                    'min:8',
                ],

                'role' => [
                    'required',
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

        // Branch manager can only create employees
        if ($user->role === 'branch_manager') {
            return [
                'name' => [
                    'required',
                    'string',
                    'min:3',
                    'max:50',
                ],

                'user_name' => [
                    'required',
                    'string',
                    'min:3',
                    'max:50',
                    'unique:users,user_name',
                ],

                'password' => [
                    'required',
                    'string',
                    'min:8',
                ],
            ];
        }

        return [];
    }
}
