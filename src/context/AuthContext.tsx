"use client";

import { createContext, useContext, useMemo, useState, useEffect, ReactNode } from "react";
import { User } from "@/types/User";

interface AuthContextType {
    user: User | null;
    token: string | null;
    setAuth: (user: User, token: string) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getInitialUser() {
    const rawUser = localStorage.getItem("user");
    if (!rawUser) return null;

    try {
        return JSON.parse(rawUser) as User;
    } catch {
        localStorage.removeItem("user");
        return null;
    }
}

function getInitialToken() {
    const match = document.cookie.match(/(^|;)\s*token=([^;]+)/);
    return match ? decodeURIComponent(match[2]) : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initialUser = getInitialUser();
        const initialToken = getInitialToken();
        setUser(initialUser);
        setToken(initialToken);
        setIsLoading(false);
    }, []);

    const setAuth = (user: User, token: string) => {
        setUser(user);
        setToken(token);

        if (typeof window !== "undefined") {
            localStorage.setItem("user", JSON.stringify(user));
            document.cookie = `token=${encodeURIComponent(token)}; path=/;`;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);

        if (typeof window !== "undefined") {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            document.cookie = "token=; path=/; max-age=0";
            window.location.href = "/Login";
        }
    };

    const value = useMemo(
        () => ({ user, token, setAuth, logout, isLoading }),
        [user, token, isLoading]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}