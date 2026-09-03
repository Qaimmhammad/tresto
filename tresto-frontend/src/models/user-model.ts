


export type UserRole = 
| "admin"
| "branch_manager"
| "employee"

type User = {
    id: string,
    name: string,
    userName: string,
    role: UserRole,
    restaurantId: string,
    createdAt: string, 
    updatedAt: string,
    branch: {
        branchId: string,
        name: string
    } 
}

export default User ; 