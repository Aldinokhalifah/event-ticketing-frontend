import { Metadata } from "next";
import RegisterPageClient from "./RegisterClient";

export const metadata: Metadata = {
    title: "Register Tiketin",
    description: "Halaman untuk mendafatarkan akun di Tiketin",
};

export default function RegisterPage() {
    return (
        <RegisterPageClient />
    )
}