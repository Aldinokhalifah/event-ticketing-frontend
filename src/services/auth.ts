import { apiClient } from "@/lib/api";
import { LoginRequest } from "@/types/request/LoginRequest";
import { RegisterRequest } from "@/types/request/RegisterRequest";
import { AuthResponse } from "@/types/response/AuthResponse";

export const authService = {
    login: (data: LoginRequest) =>
            apiClient<AuthResponse>("/auth/login", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    register: (data: RegisterRequest) =>
            apiClient<AuthResponse>("/auth/register", {
            method: "POST",
            body: JSON.stringify(data),
        }),
};