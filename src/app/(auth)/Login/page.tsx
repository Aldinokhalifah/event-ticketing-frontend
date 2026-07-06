import { Metadata } from "next";
import LoginPageClient from "./LoginClient";

export const metadata: Metadata = {
    title: "Login Tiketin",
    description: "Halaman untuk masuk ke Tiketin",
};

export default function LoginPage() {

    return (
        <LoginPageClient />
    );
}