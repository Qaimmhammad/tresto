import serverFetch from "../../../api/server-client"
import User from "@/models/user-model"

export async function getCurrentUser(): Promise<User | null> {
  try {
      return serverFetch<User>("/user") ; 
  } catch (error) {
    return null ; 
  }
}