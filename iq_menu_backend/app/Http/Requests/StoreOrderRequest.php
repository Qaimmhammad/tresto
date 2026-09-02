<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'order_type' => [
                'required',
                Rule::in([
                    'pickup',
                    'delivery',
                ]),
            ],

            'address' => [
                'required_if:order_type,delivery',
                'nullable',
                'string',
                'max:500',
            ],

            'customer_name' => [
                'required',
                'string',
                'max:100',
            ],

            'customer_phone_number' => [
                'required_if:order_type,delivery',
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
                'string',
            ],
        ];
    }
}