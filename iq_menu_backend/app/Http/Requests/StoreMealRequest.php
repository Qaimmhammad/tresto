<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMealRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => [
                'required',
                'ulid',
                'exists:categories,id',
            ],

            'name' => [
                'required',
                'string',
                'min:3',
                'max:100',
            ],

            'price' => [
                'required',
                'integer',
                'min:0',
            ],

            'description' => [
                'nullable',
                'string',
            ],

            'image_url' => [
                'nullable',
                'string',
                'url',
                'max:2048',
            ],

            'is_available' => [
                'sometimes',
                'boolean',
            ],

            'options' => [
                'nullable',
                'array',
            ],

            'options.*.name' => [
                'required',
                'string',
                'min:1',
                'max:100',
            ],

            'options.*.price' => [
                'required',
                'integer',
                'min:0',
            ],
        ];
    }
}