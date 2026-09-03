import serverFetch from "../server-client"
import CategoryModel from "@/models/category-model"
import TableModel from "@/models/table-model"
import MealModel from "@/models/meal-model"

export type CreateTablePayload = {
  tableNumber: number,
  status?: string
}

export type UpdateTablePayload = {
  tableNumber?: number
  capacity?: number
  status?: string
}

export type TableMenuResponse = {
  table: TableModel
  categories: CategoryModel[]
  meals: MealModel[]
}

export async function getTables(
  branchId: string 
): Promise<TableModel[]> {
  return serverFetch<TableModel[]>(`/api/branches/${branchId}/tables`)
}

export async function createTable(
  branchId: string ,
  data: CreateTablePayload
): Promise<TableModel> {
  return serverFetch<TableModel>(`/api/branches/${branchId}/tables`, {
    method: "POST",
    body: JSON.stringify({
      table_number: data.tableNumber,
      status: data.status,
    }),
  })
}

export async function getTable(id: string | number): Promise<TableModel> {
  return serverFetch<TableModel>(`/api/tables/${id}`)
}

export async function updateTable(
  id: string | number,
  data: UpdateTablePayload
): Promise<TableModel> {
  return serverFetch<TableModel>(`/api/tables/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      table_number: data.tableNumber,
      status: data.status,
    }),
  })
}

export async function deleteTable(
  id: string | number
): Promise<{ message: string }> {
  return serverFetch<{ message: string }>(`/api/tables/${id}`, {
    method: "DELETE",
  })
}

export async function getTableMenu(
  tableId: string | number
): Promise<TableMenuResponse> {
  return serverFetch<TableMenuResponse>(`/api/t/${tableId}/menu`)
}