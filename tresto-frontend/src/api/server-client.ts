import "server-only";

import { BASE_API_URL } from "../../constants";
import { cookies } from "next/headers";

type ServerFetchOptions = RequestInit ; 

export default async function serverFetch<T>(
    endpoint: string,
    options: ServerFetchOptions = {}
): Promise<T> {
    const CookieStore = await cookies();
    const token = CookieStore.get("access_token")?.value; 
    const headers = new Headers(options.headers);
    headers.set("Accept" , "application/json");
    if (options.body) {
    headers.set("Content-Type", "application/json")
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  const response = await fetch(
    `${BASE_API_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  )

  if (!response.ok) {
    const responseText = await response.text();

    console.error("========== API ERROR ==========");
    console.error("URL:", `${BASE_API_URL}${endpoint}`);
    console.error("Method:", options?.method ?? "GET");
    console.error("Status:", response.status);
    console.error("Response:", responseText);
    console.error("================================");

    throw new Error(
        `API request failed: ${options?.method ?? "GET"} ${BASE_API_URL}${endpoint} → ${response.status} ${responseText}`
    );
}

  return response.json() as Promise<T>
}