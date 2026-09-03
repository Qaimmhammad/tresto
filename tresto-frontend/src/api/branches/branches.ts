import serverFetch from "../server-client";
import type Branch from "@/models/branch-model";

export type CreateBranchPayload = {
  name: string;
  address?: string;
  phone?: string;
};

export type UpdateBranchPayload = {
  name?: string;
  address?: string;
};

export async function getBranches(): Promise<Branch[]> {
  return serverFetch<Branch[]>("/branches");
}

export async function createBranch(
  data: CreateBranchPayload
): Promise<Branch> {
  return serverFetch<Branch>("/api/branches", {
    method: "POST",
    body: JSON.stringify({
      name: data.name,
      address: data.address,
      phone: data.phone,
    }),
  });
}

export async function getBranch(
  branchId: string
): Promise<Branch> {
  return serverFetch<Branch>(`/branches/${branchId}`);
}

export async function updateBranch(
  branchId: string,
  data: UpdateBranchPayload
): Promise<Branch> {
  return serverFetch<Branch>(`/branches/${branchId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteBranch(
  branchId: string | number
): Promise<{ message: string }> {
  return serverFetch<{ message: string }>(
    `/branches/${branchId}`,
    {
      method: "DELETE",
    }
  );
}