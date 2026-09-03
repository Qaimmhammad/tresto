"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type RegistrationFieldProps = {
    label: string;
    name: string;
    type?: "text" | "password";
    placeholder?: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
};

export default function RegistrationField({
    label,
    name,
    type = "text",
    placeholder,
    required,
    minLength,
    maxLength,
}: RegistrationFieldProps) {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";

    const inputType =
        isPassword && showPassword
            ? "text"
            : type;

    return (
        <div className="space-y-2">
            <label
                htmlFor={name}
                className="block text-gray-900 font-semibold mb-2"
            >
                {label}
            </label>

            <div className="relative">
                <input
                    id={name}
                    name={name}
                    type={inputType}
                    placeholder={placeholder}
                    required={required}
                    minLength={minLength}
                    maxLength={maxLength}
                    className={`text-black w-full px-5 py-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-900 ${
                        isPassword ? "pl-12 text-left" : ""
                    }`}
                    style={
                        isPassword
                            ? { direction: "rtl" }
                            : undefined
                    }
                />

                {isPassword && (
                    <button
                        type="button"
                        onClick={() =>
                            setShowPassword(!showPassword)
                        }
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-black hover:text-gray-600 transition-colors"
                        aria-label={
                            showPassword
                                ? "Hide password"
                                : "Show password"
                        }
                    >
                        {showPassword ? (
                            <EyeOff size={22} />
                        ) : (
                            <Eye size={22} />
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}