import serverFetch from "../server-client"
import CategoryModel from "@/models/category-model"

export type CreateCategoryPayload = {
  name: string
  description?: string
  restaurantId?: string
}

export type UpdateCategoryPayload = {
  name?: string
  description?: string
}

export async function getCategories(): Promise<CategoryModel[]> {
  return serverFetch<CategoryModel[]>("/categories")
}

export async function createCategory(
  data: CreateCategoryPayload
): Promise<CategoryModel> {
  return serverFetch<CategoryModel>("/categories", {
    method: "POST",
    body: JSON.stringify({
      name: data.name,
      description: data.description,
      restaurant_id: data.restaurantId,
    }),
  })
}

export async function getCategory(
  categoryId: string 
): Promise<CategoryModel> {
  return serverFetch<CategoryModel>(`/categories/${categoryId}`)
}

export async function updateCategory(
  categoryId: string,
  data: UpdateCategoryPayload
): Promise<CategoryModel> {
  return serverFetch<CategoryModel>(`/categories/${categoryId}`, {
    method: "PUT",
    body: JSON.stringify({
      name: data.name,
      description: data.description,
    }),
  })
}

export async function deleteCategory(
  categoryId: string 
): Promise<{ message: string }> {
  return serverFetch<{ message: string }>(`/categories/${categoryId}`, {
    method: "DELETE",
  })
}