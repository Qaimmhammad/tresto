import User from "@/models/user-model";
import serverFetch from "../server-client";

type UsersResponse = {
    data: User[]
}


export default async function getAllUsers(): Promise<User[]>{
    const response = await serverFetch<UsersResponse>("/users/all");
    return response.data;
}