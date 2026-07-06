'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { NavItem } from '@/types/NavItem'

const PUBLIC_NAV: NavItem[] = [
    { href: '/event', label: 'Events' },
]

const USER_NAV: NavItem[] = [
    { href: '/orders', label: 'Order Saya' },
    { href: '/tikets', label: 'Tiket Saya' },
]

export default function Navbar() {
    const pathname = usePathname()
    const router = useRouter()
    const { user, logout } = useAuth()

    const [menuOpen, setMenuOpen] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Tutup dropdown kalau klik di luar
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Tutup mobile menu saat navigasi
    useEffect(() => {
        setMenuOpen(false)
        setDropdownOpen(false)
    }, [pathname])

    const isActive = (path: string): boolean =>
        path === '/' ? pathname === '/' : pathname.startsWith(path)

    const handleLogout = (): void => {
        logout()
        router.push('/Login')
    }

    // Inisial nama untuk avatar
    const getInitials = (nama: string): string =>
        nama
            .split(' ')
            .slice(0, 2)
            .map((n) => n[0])
            .join('')
            .toUpperCase()

    // ── Class Helpers ──────────────────────────────────────────────────────

    const navLinkClass = (path: string): string =>
        `relative px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${
            isActive(path)
                ? 'text-amber-400'
                : 'text-slate-400 hover:text-slate-100'
        }`

    const mobileNavLinkClass = (path: string): string =>
        `block w-full text-left px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
            isActive(path)
                ? 'bg-amber-400/10 text-amber-400'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
        }`

    // ── Nav Links (Desktop) ────────────────────────────────────────────────

    const renderDesktopNav = () => (
        <nav className="hidden md:flex items-center gap-1">
            {PUBLIC_NAV.map((item) => (
                <Link key={item.href} href={item.href} className={navLinkClass(item.href)}>
                    {item.label}
                    {isActive(item.href) && (
                        <span className="absolute bottom-0 left-3 right-3 h-px bg-amber-400 rounded-full" />
                    )}
                </Link>
            ))}

            {user?.role === 'USER' &&
                USER_NAV.map((item) => (
                    <Link key={item.href} href={item.href} className={navLinkClass(item.href)}>
                        {item.label}
                        {isActive(item.href) && (
                            <span className="absolute bottom-0 left-3 right-3 h-px bg-amber-400 rounded-full" />
                        )}
                    </Link>
                ))}

            {user?.role === 'ADMIN' && (
                <Link href="/admin/events" className={navLinkClass('/admin')}>
                    Admin Panel
                    {isActive('/admin') && (
                        <span className="absolute bottom-0 left-3 right-3 h-px bg-amber-400 rounded-full" />
                    )}
                </Link>
            )}
        </nav>
    )

    // ── Auth Section (Desktop) ─────────────────────────────────────────────

    const renderDesktopAuth = () => {
        if (!user) {
            return (
                <div className="hidden md:flex items-center gap-2">
                    <Link
                        href="/login"
                        className="px-4 py-1.5 text-sm font-medium text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 rounded-lg transition-colors duration-200"
                    >
                        Masuk
                    </Link>
                    <Link
                        href="/register"
                        className="px-4 py-1.5 text-sm font-medium text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors duration-200"
                    >
                        Daftar
                    </Link>
                </div>
            )
        }

        return (
            <div className="hidden md:flex items-center gap-3" ref={dropdownRef}>
                {/* Avatar dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors duration-200 group"
                    >
                        {/* Avatar circle */}
                        <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-bold shrink-0">
                            {getInitials(user.nama)}
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-medium text-slate-200 leading-none">{user.nama}</p>
                            <p className="text-xs text-slate-500 mt-0.5 leading-none">{user.role}</p>
                        </div>
                        {/* Chevron */}
                        <svg
                            className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Dropdown menu */}
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-44 bg-slate-900 border border-slate-700/60 rounded-xl shadow-xl shadow-black/40 overflow-hidden z-50">
                            <div className="px-3 py-2.5 border-b border-slate-800">
                                <p className="text-xs text-slate-500 truncate">{user.email}</p>
                            </div>
                            <div className="p-1">
                                {user.role === 'USER' && (
                                    <>
                                        <Link
                                            href="/orders"
                                            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
                                        >
                                            <span>🎟️</span> Order Saya
                                        </Link>
                                        <Link
                                            href="/tikets"
                                            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
                                        >
                                            <span>🎫</span> Tiket Saya
                                        </Link>
                                    </>
                                )}
                                {user.role === 'ADMIN' && (
                                    <Link
                                        href="/admin/events"
                                        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
                                    >
                                        <span>⚙️</span> Admin Panel
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors mt-0.5"
                                >
                                    <span>↩</span> Keluar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    // ── Mobile Menu ────────────────────────────────────────────────────────

    const renderMobileMenu = () => {
        if (!menuOpen) return null

        return (
            <div className="md:hidden border-t border-slate-800/60">
                <div className="px-3 py-3 space-y-1">
                    {PUBLIC_NAV.map((item) => (
                        <Link key={item.href} href={item.href}>
                            <button className={mobileNavLinkClass(item.href)}>{item.label}</button>
                        </Link>
                    ))}

                    {user?.role === 'USER' &&
                        USER_NAV.map((item) => (
                            <Link key={item.href} href={item.href}>
                                <button className={mobileNavLinkClass(item.href)}>{item.label}</button>
                            </Link>
                        ))}

                    {user?.role === 'ADMIN' && (
                        <Link href="/admin/events">
                            <button className={mobileNavLinkClass('/admin')}>Admin Panel</button>
                        </Link>
                    )}
                </div>

                {/* Auth section — mobile */}
                <div className="px-3 pb-3 pt-2 border-t border-slate-800/60">
                    {!user ? (
                        <div className="flex flex-col gap-2">
                            <Link href="/login">
                                <button className="w-full px-4 py-2 text-sm font-medium text-slate-300 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors">
                                    Masuk
                                </button>
                            </Link>
                            <Link href="/register">
                                <button className="w-full px-4 py-2 text-sm font-medium text-slate-950 bg-amber-400 rounded-lg hover:bg-amber-300 transition-colors">
                                    Daftar
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <div>
                            {/* User info */}
                            <div className="flex items-center gap-3 px-1 py-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-bold shrink-0">
                                    {getInitials(user.nama)}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-200">{user.nama}</p>
                                    <p className="text-xs text-slate-500">{user.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full px-4 py-2 text-sm font-medium text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-colors"
                            >
                                Keluar
                            </button>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    // ── Render ─────────────────────────────────────────────────────────────

    return (
        <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 shrink-0">
                    <span className="font-bold text-white text-sm tracking-tight">
                        Tiketin
                    </span>
                </Link>

                {/* Desktop nav + auth */}
                {renderDesktopNav()}
                {renderDesktopAuth()}

                {/* Hamburger — mobile only */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden flex flex-col justify-center gap-1.5 w-8 h-8 hover:opacity-70 transition-opacity"
                    aria-label="Toggle menu"
                >
                    <span className={`w-5 h-px bg-slate-300 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-1.75' : ''}`} />
                    <span className={`w-5 h-px bg-slate-300 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
                    <span className={`w-5 h-px bg-slate-300 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-1.75' : ''}`} />
                </button>
            </div>

            {/* Mobile menu */}
            {renderMobileMenu()}
        </header>
    )
}