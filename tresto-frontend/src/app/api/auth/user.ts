import serverFetch from "../../../api/server-client"
import User from "@/models/user-model"

type UserData = {
  user: User,
  slug: [
    {
    slug: string
  }
  ]
}

export async function getCurrentUser(): Promise<UserData | null> {
  try {
      return serverFetch<UserData>("/user") ; 
  } catch (error) {
    return null ; 
  }
}