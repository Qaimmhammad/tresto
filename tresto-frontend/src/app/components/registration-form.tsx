"use client";

import RegistrationField from "./registration-fields";
import RouteButton from "./route-button";
import { useRouter } from "next/navigation";
import { useRestaurantRegistrationStore } from "../stores/restaurant-registration-store";

export type RegistrationFieldData = {
  label: string;
  name: string;
  type?: "text" | "password";
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  minLength?: number;
};

type RegistrationFormProps = {
  fields: RegistrationFieldData[];
  formTitle: string;
  formDescription: string;
  route: string;
  storageKey: string;
};



export default function RegistrationForm({
  fields,
  formTitle,
  formDescription,
  route,
  storageKey
}: RegistrationFormProps) {
  const router = useRouter();

  const updateRestaurant =
    useRestaurantRegistrationStore(
      (state) => state.updateRestaurant
    );

  const updateAdmin =
    useRestaurantRegistrationStore(
      (state) => state.updateAdmin
    );

  const handleSubmit = (formData: FormData) => {
    const data = Object.fromEntries(formData.entries());

    const restaurantName = data.restaurantName as string;

    const admin = {
      name: data.name as string,
      password: data.password as string,
      userName: data.username as string,
    };

    updateRestaurant({
      name: restaurantName,
    });

    updateAdmin(admin);

    console.log(
      "Restaurant:",
      restaurantName
    );

    console.log(
      "Admin:",
      admin
    );

    router.push(route);
  };

  return (
    <form action={handleSubmit}>
      <div className="bg-white rounded-3xl py-6 px-4 md:px-6 w-full max-w-lg shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">

        <span className="text-2xl font-bold text-black block">
          {formTitle}
        </span>

        <span className="text-gray-700 block pb-8">
          {formDescription}
        </span>

        {fields.map((field) => (
          <RegistrationField
            key={field.name}
            label={field.label}
            name={field.name}
            type={field.type}
            placeholder={field.placeholder}
            required={field.required}
            maxLength={field.maxLength}
            minLength={field.minLength}
          />
        ))}

        <RouteButton
          title="متابعة"
          fontSize={20}
          fontWeight="normal"
          type="submit"
        />
      </div>
    </form>
  );
}
