
export type MostOrderedItem = { 
    id: string ,
    name: string, 
    ordersCount: number
}

type DashboardSummary = { 
    mealsCount: number,
    ordersCount: number,
    tablesCount: number, 
    branchesCount: number, 
    employeesCount: number,
    ordersTodayCount: number,
    mostOrderedItems: MostOrderedItem[]
}


export default DashboardSummary ;