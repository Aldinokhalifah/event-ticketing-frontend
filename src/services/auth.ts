import { apiClient } from "@/lib/api"

export const register = async (name: string, email: string, password: string) => {
    return await apiClient("/register", {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
    })
};

export const login = async (email: string, password: string) => {
    return await apiClient("/login", {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    })
};