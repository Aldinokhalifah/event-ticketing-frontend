"use client"

import { useRegister } from "@/hooks/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function RegisterPageClient() {

    const router = useRouter();
    const [formData, setFormData] = useState({
        nama: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const { mutate: registerMutate, isPending } = useRegister()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target as HTMLInputElement;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Kata sandi tidak cocok');
            toast.error('Kata sandi tidak cocok');
            return;
        }
        if (formData.password.length < 6) {
            setError('Kata sandi minimal 6 karakter');
            toast.error('Kata sandi minimal 6 karakter');
            return;
        }

        registerMutate(
            {
                nama: formData.nama,
                email: formData.email,
                password: formData.password
            },
            {
                onSuccess: () => {
                    router.push('/event');
                }, 
                onError: (err) => {
                    setError(err.message || 'Registrasi gagal');
                }
            }
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center  p-4">
            <div className="w-full max-w-md">
                <div className="rounded-2xl shadow-lg p-8 shadow-gray-600 bg-slate-900">

                    {/* Heading */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-white">Buat Akun</h1>
                        <p className="text-sm text-gray-500 mt-1">Daftar untuk memulai membeli tiket</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-1.5">
                        <label htmlFor="nama" className="text-sm font-medium text-slate-300">Nama Lengkap</label> <span className="text-red-400">*</span>
                        <input
                            id="nama"
                            type="text"
                            placeholder="John Doe"
                            name="nama"
                            value={formData.nama}
                            onChange={handleChange}
                            required
                            className="w-full h-10 px-3 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                        />
                        </div>

                        <div className="space-y-1.5">
                        <label htmlFor="email" className="text-sm font-medium text-slate-300">Email</label> <span className="text-red-400">*</span>
                        <input
                            id="email"
                            type="email"
                            placeholder="nama@perusahaan.com"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full h-10 px-3 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                        />
                        </div>

                        <div className="space-y-1.5">
                        <label htmlFor="password" className="text-sm font-medium text-slate-300">Kata Sandi</label> <span className="text-red-400">*</span>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full h-10 px-3 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                        />
                        </div>

                        <div className="space-y-1.5">
                        <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-300">Konfirmasi Kata Sandi</label> <span className="text-red-400">*</span>
                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full h-10 px-3 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                        />
                        </div>

                        <button
                        type="submit"
                        disabled={isPending}
                        className="w-full h-10 bg-amber-400 text-slate-950 font-semibold hover:bg-amber-300 transition-all disabled:bg-yellow-400 text-sm rounded-lg mt-2 disabled:opacity-50 disable:cursor-not-allowed"
                        >
                        {isPending ? (
                            <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            Memproses...
                            </span>
                        ) : 'Daftar'}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <p className="text-center text-sm text-gray-500">
                        Sudah punya akun?{' '}
                        <Link href="/Login" className="text-yellow-600 hover:underline font-medium">
                            Masuk di sini
                        </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}