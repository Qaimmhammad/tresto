<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreRestaurantRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [

            /*
            |--------------------------------------------------------------------------
            | Restaurant
            |--------------------------------------------------------------------------
            */

            'restaurant' => [
                'required',
                'array',
            ],

            'restaurant.name' => [
                'required',
                'string',
                'min:3',
                'max:50',
            ],


            /*
            |--------------------------------------------------------------------------
            | Admin
            |--------------------------------------------------------------------------
            */

            'admin' => [
                'required',
                'array',
            ],

            "admin.name" => [
                "string",
                "required"
            ],

            'admin.user_name' => [
                'required',
                'string',
                'unique:users,user_name',
            ],

            'admin.password' => [
                'required',
                'string',
                'min:6',
            ],


            'settings' => [
                'required',
                'array',
            ],

            'settings.logo_url' => [
                'required',
                'string',
            ],

            'settings.title' => [
                'required',
                'string',
            ],

            'settings.subtitle' => [
                'nullable',
                'string',
            ],

            'settings.primary_color' => [
                'required',
                'string',
            ],

            'settings.secondary_color' => [
                'nullable',
                'string',
            ],

            'settings.hero_image_url' => [
                'nullable',
                'string',
            ],
        ];
    }
}


