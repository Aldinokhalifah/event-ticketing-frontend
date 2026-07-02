import { Role } from "../enum/Role";

export interface AuthResponse {
    token: string,
    nama: string,
    email: string,
    role: Role
};