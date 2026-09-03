import serverFetch from "../server-client";
import DashboardSummary from "@/models/dashboard-summary-model";


export default async function getSummary(): Promise<DashboardSummary>{
    return serverFetch<DashboardSummary>("/dashboard/summary");
}
