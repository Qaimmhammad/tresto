<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBranchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'sometimes',
                'string',
                'max:50',
            ],

            'address' => [
                'sometimes',
                'string',
                'max:100',
            ],

            'longitude' => [
                'sometimes',
                'numeric',
                'between:-180,180',
            ],

            'latitude' => [
                'sometimes',
                'numeric',
                'between:-90,90',
            ],

            'status' => [
                'sometimes',
                'string',
            ],
        ];
    }
}