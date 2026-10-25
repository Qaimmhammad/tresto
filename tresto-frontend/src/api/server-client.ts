import "server-only";

import { BASE_API_URL } from "../../constants";
import { cookies } from "next/headers";

type ServerFetchOptions = RequestInit;

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export default async function serverFetch<T>(
  endpoint: string,
  options: ServerFetchOptions = {}
): Promise<T> {
  const CookieStore = await cookies();
  const token = CookieStore.get("access_token")?.value;
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
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

    let data: unknown;

    try {
      data = JSON.parse(responseText);
    } catch {
      data = { message: responseText };
    }

    console.error("API Error:", {
      url: `${BASE_API_URL}${endpoint}`,
      method: options.method ?? "GET",
      status: response.status,
    });

    const message =
      typeof data === "object" &&
        data !== null &&
        "message" in data &&
        typeof data.message === "string"
        ? data.message
        : "API request failed";

    throw new ApiError(message, response.status, data);
  }

  return response.json() as Promise<T>
}