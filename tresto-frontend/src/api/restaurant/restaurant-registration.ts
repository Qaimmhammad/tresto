import serverFetch from "@/api/server-client"
import { cookies } from "next/headers"

export type RestaurantRegistration = {
  restaurant: {
    name: string
  }

  restaurantSettings: {
    logoUrl: string
    primaryColor: string
    secondaryColor: string | null
    title: string
    subtitle: string | null
    heroImageUrl: string | null
  }

  admin: {
    name: string
    password: string
    userName: string
  }
}

type RestaurantRegistrationResponse = {
  message: string;

  restaurant: {
    id: string;
    name: string;
    slug: string;
    created_at: string;
    updated_at: string;
  };

  admin: {
    id: string;
    name: string;
    user_name: string;
    role: string;
    restaurant_id: string;
    branch_id: string | null;
    created_at: string;
    updated_at: string;
  };

  settings: {
    id: string;
    restaurant_id: string;
    primary_color: string;
    secondary_color: string | null;
    logo_url: string;
    title: string;
    subtitle: string | null;
    hero_image_url: string | null;
    created_at: string;
    updated_at: string;
  };

  token: string;
};

export default async function restaurantRegistration(
  data: RestaurantRegistration
): Promise<RestaurantRegistrationResponse> {
  const response = await serverFetch<RestaurantRegistrationResponse>(
    "/restaurant",
    {
      method: "POST",

      body: JSON.stringify({
        restaurant: {
          name: data.restaurant.name,
        },

        admin: {
          name: data.admin.name,
          user_name: data.admin.userName,
          password: data.admin.password,
        },

        settings: {
          logo_url: data.restaurantSettings.logoUrl,
          primary_color: data.restaurantSettings.primaryColor,
          secondary_color: data.restaurantSettings.secondaryColor,
          title: data.restaurantSettings.title,
          subtitle: data.restaurantSettings.subtitle,
          hero_image_url: data.restaurantSettings.heroImageUrl,
        },
      }),
    }
  );

  const cookieStore = await cookies();
  cookieStore.set("access_token", response.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14
  })
  return response;
}