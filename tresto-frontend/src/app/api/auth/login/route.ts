import serverFetch from "@/api/server-client"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

type LoginCredentials = {
  userName: string
  password: string
}

type LoginResponse = {
  message: string
  token: string
}

export async function POST(request: Request) {
  try {
    const { userName, password } =
      await request.json() as LoginCredentials

    const data = await serverFetch<LoginResponse>("/login", {
      method: "POST",
      body: JSON.stringify({
        user_name: userName,
        password,
      }),
    })

    const cookieStore = await cookies()

    cookieStore.set("access_token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 14 
    })

    return NextResponse.json({
      message: data.message,
    })
  } catch {
    return NextResponse.json(
      {
        message: "Login failed",
      },
      { status: 500 }
    )
  }
}