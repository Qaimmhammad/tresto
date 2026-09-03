

type Order = { 
    id: string,
    address: string | null, 
    restaurantId: string,
    branchId: string,
    tableId: string | null,
    customerName: string , 
    customerPhoneNumber: string | null,
    description: string | null,
    orderType: "delivery" | "pick_up" | "dine_in",
    status: "in_progress" | "completed" | "in_kitchen"
}

export default Order ; 