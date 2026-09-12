"use server";

import type Branch from "@/models/branch-model";
import serverFetch from "@/api/server-client";

export type CreateBranchData = {
  name: string;
  address: string;
};

export type UpdateBranchData = {
  name: string;
  address: string;
};


export async function getBranchesAction() {
  const response = await serverFetch<Branch[]>(
    `/branches`,
  );

  return response;
}

export async function createBranchAction(
  data: CreateBranchData,
): Promise<Branch> {
  return serverFetch<Branch>("/branches", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateBranchAction(
  branchId: string,
  data: UpdateBranchData,
): Promise<Branch> {
  return serverFetch<Branch>(
    `/branches/${branchId}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
  );
}

export async function deleteBranchAction(
  branchId: string,
): Promise<void> {
  await serverFetch(
    `/branches/${branchId}`,
    {
      method: "DELETE",
    },
  );
}