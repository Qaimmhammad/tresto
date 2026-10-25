"use server";

import User from "@/models/user-model";
import serverFetch from "@/api/server-client";
import Branch from "@/models/branch-model";
import { ApiError } from "@/api/server-client";

export type CreateUserData = {
  name: string;
  user_name: string;
  role: "admin" | "branch_manager" | "employee";
  branch_id: string | null;
  password:string
};

type CreateUserResult =
  | { success: true; user: User }
  | {
      success: false;
      message: string;
      errors?: Record<string, string[]>;
    };

type UpdateUserResult =
  | { success: true; user: User }
  | {
      success: false;
      message: string;
      errors?: Record<string, string[]>;
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
): Promise<CreateUserResult> {
  try {
    const user = await serverFetch<User>("/users", {
      method: "POST",
      body: JSON.stringify(data),
    });

    return { success: true, user };
  } catch (error) {
    if (error instanceof ApiError && error.status === 422) {
      const response = error.data as {
        message?: string;
        errors?: Record<string, string[]>;
      };

      return {
        success: false,
        message: response.message ?? "يرجى التحقق من البيانات المدخلة.",
        errors: response.errors,
      };
    }

    throw error;
  }
}

export async function updateUserAction(
  id: string,
  data: UpdateUserData,
): Promise<UpdateUserResult> {
  try {
    const user = await serverFetch<User>(`/users/${id}`, {
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

    return { success: true, user };
  } catch (error) {
    if (error instanceof ApiError && error.status === 422) {
      const response = error.data as {
        message?: string;
        errors?: Record<string, string[]>;
      };

      return {
        success: false,
        message: response.message ?? "يرجى التحقق من البيانات المدخلة.",
        errors: response.errors,
      };
    }

    throw error;
  }
}

export async function deleteUserAction(id: string): Promise<void> {
  await serverFetch(`/users/${id}`, {
    method: "DELETE",
  });
}

export async function getBranchesAction(): Promise<any> {
  const response: any = await serverFetch("/branches");
  return response;
}