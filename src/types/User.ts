import { Role } from "./enum/Role";

export interface User {
    id?: string,
    nama: string,
    email: string,
    role: Role
};