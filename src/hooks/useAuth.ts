import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth";
import { User } from "@/types/User";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function useLogin() {
    const router = useRouter();
    const { setAuth } = useAuth();

    return useMutation({
        mutationFn: authService.login,
        onSuccess: (data) => {
            // data di sini adalah AuthResponse: { token, nama, email, role }
            const user: User = { id: "", nama: data.nama, email: data.email, role: data.role };
            setAuth(user, data.token);
            toast.success("Login berhasil")
            // redirect ke halaman utama
            router.push("/");
        },
        onError: (error) => {
        // error.message berisi pesan dari backend (misal "Email atau password salah")
            toast.error(error?.message || "Login gagal")
        }
    });
}

export function useRegister() {
    const router = useRouter();
    const { setAuth } = useAuth();

    return useMutation({
        mutationFn: authService.register,
        onSuccess: (data) => {
            // data di sini adalah AuthResponse: { token, nama, email, role }
            const user: User = { nama: data.nama, email: data.email, role: data.role };
            setAuth(user, data.token);
            toast.success("Registrasi berhasil")
            // redirect ke halaman utama
            router.push("/");
        },
        onError: (error) => {
        // error.message berisi pesan dari backend (misal "Email atau password salah")
            toast.error(error?.message || "Registrasi gagal")
        }
    });
}