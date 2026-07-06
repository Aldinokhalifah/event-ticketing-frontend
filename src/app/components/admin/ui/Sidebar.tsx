'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { CalendarDays, QrCode, BarChart3, LogOut, Menu, X, ChevronRight, Home } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { NavItem } from '@/types/NavItem'

// ── Nav Items ─────────────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
    { label: 'Home', href: '/event', icon: Home },
    { label: 'Kelola Event', href: '/admin/events', icon: CalendarDays },
    { label: 'Check-in Tiket', href: '/admin/checkin', icon: QrCode },
    { label: 'Laporan', href: '/admin/laporan', icon: BarChart3 },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function getInitials(nama: string): string {
    return nama
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const { user, logout } = useAuth()

    const [collapsed, setCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    const isActive = (href: string): boolean =>
        pathname === href || pathname.startsWith(href + '/')

    const handleLogout = (): void => {
        logout()
        router.push('/Login')
    }

    // ── Class Helpers ──────────────────────────────────────────────────────

    const navItemClass = (href: string, isCollapsed: boolean): string =>
        `flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200
        ${isCollapsed ? 'justify-center' : ''}
        ${isActive(href)
            ? 'bg-amber-400/10 text-amber-400'
            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
        }`

    const mobileNavItemClass = (href: string): string =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200
        ${isActive(href)
            ? 'bg-amber-400/10 text-amber-400'
            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
        }`

    // ── Shared: Nav List ───────────────────────────────────────────────────

    const renderNavItems = (isCollapsed: boolean) =>
        NAV_ITEMS.map(({ label, href, icon: Icon }) => (
            <Link
                key={href}
                href={href}
                title={isCollapsed ? label : undefined}
                className={navItemClass(href, isCollapsed)}
                onClick={() => setMobileOpen(false)}
            >
                <Icon size={18} className="shrink-0" />
                {!isCollapsed && <span>{label}</span>}
                {!isCollapsed && isActive(href) && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400" />
                )}
            </Link>
        ))

    // ── Shared: User Info ──────────────────────────────────────────────────

    const renderUserInfo = (isCollapsed: boolean) => {
        if (!user) return null

        if (isCollapsed) {
            return (
                <div
                    className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-bold mx-auto mb-1"
                    title={user.nama}
                >
                    {getInitials(user.nama)}
                </div>
            )
        }

        return (
            <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-slate-800/60 mb-1">
                <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-bold shrink-0">
                    {getInitials(user.nama)}
                </div>
                <div className="overflow-hidden">
                    <p className="text-xs font-semibold text-slate-200 truncate">{user.nama}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                </div>
            </div>
        )
    }

    // ── Render ─────────────────────────────────────────────────────────────

    return (
        <>
            {/* ── Mobile top bar ───────────────────────────────────────────── */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14 bg-slate-900 border-b border-slate-800">
                <Link href="/admin/events" className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm tracking-tight">
                        Tiketin Admin
                    </span>
                </Link>
                <button
                    onClick={() => setMobileOpen(true)}
                    className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
                    aria-label="Buka menu"
                >
                    <Menu size={20} className="text-slate-400" />
                </button>
            </div>

            {/* ── Mobile overlay ───────────────────────────────────────────── */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* ── Mobile drawer ─────────────────────────────────────────────── */}
            <aside
                className={`
                    lg:hidden fixed top-0 left-0 z-50 h-full w-64
                    bg-slate-900 border-r border-slate-800
                    flex flex-col transition-transform duration-300 ease-in-out
                    ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                {/* Drawer header */}
                <div className="flex items-center justify-between px-4 h-14 border-b border-slate-800">
                    <Link href="/admin/events" className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm tracking-tight">
                            Tiketin Admin
                        </span>
                    </Link>
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                        aria-label="Tutup menu"
                    >
                        <X size={18} className="text-slate-400" />
                    </button>
                </div>

                {/* Drawer nav */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            onClick={() => setMobileOpen(false)}
                            className={mobileNavItemClass(href)}
                        >
                            <Icon size={18} className="shrink-0" />
                            <span>{label}</span>
                            {isActive(href) && (
                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400" />
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Drawer user + logout */}
                <div className="px-3 py-4 border-t border-slate-800 space-y-1">
                    {renderUserInfo(false)}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                    >
                        <LogOut size={18} className="shrink-0" />
                        Keluar
                    </button>
                </div>
            </aside>

            {/* ── Desktop sidebar ───────────────────────────────────────────── */}
            <aside
                className={`
                    hidden lg:flex flex-col fixed top-0 left-0 h-full
                    bg-slate-900 border-r border-slate-800
                    transition-all duration-300 ease-in-out z-30
                    ${collapsed ? 'w-16' : 'w-56'}
                `}
            >
                {/* Logo */}
                <div className={`flex items-center h-14 border-b border-slate-800 px-3 ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
                    <Link href="/admin/events" className="flex items-center gap-2.5">
                        {!collapsed && (
                            <span className="font-bold text-white text-sm tracking-tight truncate">
                                Tiketin Admin
                            </span>
                        )}
                    </Link>
                </div>

                {/* Nav desktop */}
                <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                    {renderNavItems(collapsed)}
                </nav>

                {/* User + logout + collapse toggle */}
                <div className="px-2 py-4 border-t border-slate-800 space-y-1">
                    {renderUserInfo(collapsed)}

                    <button
                        onClick={handleLogout}
                        title={collapsed ? 'Keluar' : undefined}
                        className={`w-full flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors
                            ${collapsed ? 'justify-center' : ''}`}
                    >
                        <LogOut size={18} className="shrink-0" />
                        {!collapsed && 'Keluar'}
                    </button>

                    {/* Collapse toggle */}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        title={collapsed ? 'Perluas sidebar' : 'Sembunyikan sidebar'}
                        className={`w-full flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-800 hover:text-slate-300 transition-colors
                            ${collapsed ? 'justify-center' : ''}`}
                    >
                        <ChevronRight
                            size={18}
                            className={`shrink-0 transition-transform duration-300 ${collapsed ? '' : 'rotate-180'}`}
                        />
                        {!collapsed && <span className="text-xs">Sembunyikan</span>}
                    </button>
                </div>
            </aside>

            {/* ── Spacer agar konten tidak tertutup sidebar ─────────────────── */}
            <div className={`hidden lg:block shrink-0 transition-all duration-300 ${collapsed ? 'w-16' : 'w-56'}`} />

            {/* ── Spacer mobile top bar ─────────────────────────────────────── */}
            <div className="lg:hidden h-14" />
        </>
    )
}