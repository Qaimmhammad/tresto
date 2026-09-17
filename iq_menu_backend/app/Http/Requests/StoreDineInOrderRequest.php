<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDineInOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_name' => [
                'required',
                'string',
                'max:100',
            ],

            'customer_phone_number' => [
                'nullable',
                'string',
                'max:30',
            ],

            'description' => [
                'nullable',
                'string',
                'max:1000',
            ],

            'items' => [
                'required',
                'array',
                'min:1',
            ],

            'items.*.meal_id' => [
                'required',
                'ulid',
                'exists:meals,id',
            ],

            'items.*.quantity' => [
                'required',
                'integer',
                'min:1',
            ],

            'items.*.selected_options' => [
                'nullable',
                'array',
            ],

            'items.*.selected_options.*' => [
                'required',
                'array',
            ],

            'items.*.selected_options.*.name' => [
                'required',
                'string',
                'max:100',
            ],

            'items.*.selected_options.*.price' => [
                'required',
                'numeric',
                'min:0',
            ],
        ];
    }
}
