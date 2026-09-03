"use server" 

import { getCurrentUser } from "../api/auth/user"

export default async function getUserAction() {
    return getCurrentUser();
}