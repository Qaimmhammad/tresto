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
    throw new Error(
      `API request failed with status ${response.status}`
    )
  }

  return response.json() as Promise<T>
}