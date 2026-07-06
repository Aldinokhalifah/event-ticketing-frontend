"use client";

import { useLogin } from "@/hooks/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPageClient() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const { mutate: login, isPending } = useLogin();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        login(
            { email, password },
            {
                onSuccess: () => {
                    router.push('/event')
                },
                onError: (err: { message?: string }) => {
                    setError(err?.message || 'Login gagal')
                },
            }
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 ">
            <div className="w-full max-w-md ">
                <div className="rounded-2xl shadow-lg p-8 shadow-gray-600 bg-slate-900">

                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-white">Selamat Datang</h1>
                        <p className="text-sm text-gray-500 mt-1">Masuk ke Tiketin</p>
                    </div>

                    {error && (
                        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-1.5">
                        <label htmlFor="email" className="text-sm font-medium text-slate-300">Email</label> <span className="text-red-400">*</span>
                        <input
                            id="email"
                            type="email"
                            placeholder="nama@perusahaan.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                        ) : 'Masuk'}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <p className="text-center text-sm text-gray-500">
                        Belum punya akun?{' '}
                        <Link href="/Register" className="text-yellow-600 hover:underline font-medium">
                            Daftar di sini
                        </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}