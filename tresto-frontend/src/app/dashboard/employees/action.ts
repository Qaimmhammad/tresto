"use server";

import User from "@/models/user-model";
import serverFetch from "@/api/server-client";
import Branch from "@/models/branch-model";

export type CreateUserData = {
  name: string;
  user_name: string;
  role: "admin" | "branch_manager" | "employee";
  branch_id: string | null;
  password:string
};

export type UpdateUserData = {
  name: string;
  userName: string;
  role: "admin" | "branch_manager" | "employee";
  branchId: string | null;
  password?: string
};

type UsersResponse = {
  data: User[];
};

export async function getUsersAction(): Promise<User[]> {
  const response = await serverFetch<UsersResponse>("/users/all");

  return response.data;
}

export async function createUserAction(
  data: CreateUserData,
): Promise<User> {
  return serverFetch<User>("/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateUserAction(
  id: string,
  data: UpdateUserData,
): Promise<User> {
  return serverFetch<User>(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      name: data.name,
      user_name: data.userName,
      role: data.role,
      branch_id: data.branchId,
      ...(data.password
        ? { password: data.password }
        : {}),
    }),
  });
}

export async function deleteUserAction(id: string): Promise<void> {
  await serverFetch(`/users/${id}`, {
    method: "DELETE",
  });
}

export async function getBranchesAction() : Promise<any> {
  const response = await serverFetch("/branches");
  return response?.data ; 
}