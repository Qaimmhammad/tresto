"use server";

import { revalidatePath } from "next/cache";
import serverFetch from "../../../api/server-client";
import CategoryModel from "@/models/category-model";
import { getCategories } from "@/api/categories/categories";
import { createCategory } from "@/api/categories/categories";
import { CreateCategoryPayload } from "@/api/categories/categories";

export async function getCategoriesAction(): Promise<CategoryModel[]> {
  return getCategories();
}

export async function createCategoryAction(
  data: CreateCategoryPayload,
): Promise<CategoryModel> {
  return createCategory(data);
}
