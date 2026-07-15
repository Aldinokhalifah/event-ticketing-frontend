'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { MapPin, Calendar, Clock, ArrowLeft, Ticket } from 'lucide-react'
import { useGetEvent } from '@/hooks/useEvent'
import { useGetAllTiketKategori } from '@/hooks/useTiketKategori'
import { useAuth } from '@/context/AuthContext'
import { getEventGradientStyle } from '@/utils/eventColor'
import { formatTanggal } from '@/utils/formatTanggal'
import { formatWaktu } from '@/utils/formatWaktu'
import StatusBadge from '../StatusBadge'
import TiketKategoriCard from './TiketKategoriCard'
import OrderModal from './OrderModal'
import AdminEventActions from './AdminEventActions'
import { TiketKategoriResponse } from '@/types/response/TiketKategoriResponse'
import EventDetailSkeleton from './EventDetailSkeleton'

export default function EventDetail() {
    const params = useParams()
    const router = useRouter()
    const { user } = useAuth()

    const id = params.id as string
    const { data: event, isPending: isEventLoading, isError } = useGetEvent(id)
    const { data: kategoris, isPending: isKategoriLoading } = useGetAllTiketKategori(id)

    const [selectedKategori, setSelectedKategori] = useState<TiketKategoriResponse | null>(null)

    if (isEventLoading) return <EventDetailSkeleton />

    if (isError || !event) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center space-y-3">
                    <p className="text-4xl">😕</p>
                    <p className="text-slate-300 font-medium">Event tidak ditemukan</p>
                    <button
                        onClick={() => router.push('/')}
                        className="text-amber-400 text-sm hover:text-amber-300 transition-colors"
                    >
                        Kembali ke beranda
                    </button>
                </div>
            </div>
        )
    }

    const gradientStyle = getEventGradientStyle(event.id)
    const isAdmin = user?.role === 'ADMIN'
    const isLoggedIn = !!user

    return (
        <>
            <div className="min-h-screen bg-slate-950">
                {/* ── Hero Banner ───────────────────────────────────────────── */}
                <div className="relative h-56 sm:h-72 overflow-hidden">
                    {/* Gradient background */}
                    <div className="absolute inset-0" style={gradientStyle} />

                    {/* Noise texture */}
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
                        }}
                    />

                    {/* Bottom fade */}
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/30 to-transparent" />

                    {/* Back button */}
                    <div className="absolute top-4 left-4 sm:left-6">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/30 backdrop-blur-sm text-white/80 hover:text-white text-sm font-medium transition-colors"
                        >
                            <ArrowLeft size={15} />
                            Kembali
                        </button>
                    </div>

                    {/* Status badge */}
                    <div className="absolute top-4 right-4 sm:right-6">
                        <StatusBadge status={event.status} />
                    </div>
                </div>

                {/* ── Content ───────────────────────────────────────────────── */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-6 pb-16 relative">

                    {/* Admin actions */}
                    {isAdmin && (
                        <div className="mb-6 p-4 bg-slate-900/80 border border-slate-700/60 rounded-2xl backdrop-blur-sm">
                            <p className="text-xs text-slate-500 mb-3 font-medium uppercase tracking-wider">
                                Admin Actions
                            </p>
                            <AdminEventActions event={event} />
                        </div>
                    )}

                    {/* Event title + meta */}
                    <div className="mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight tracking-tight">
                            {event.nama}
                        </h1>

                        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                                <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center">
                                    <MapPin size={12} className="text-amber-400" />
                                </div>
                                {event.lokasi}
                            </div>
                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                                <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center">
                                    <Calendar size={12} className="text-amber-400" />
                                </div>
                                {formatTanggal(event.tanggal)}
                            </div>
                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                                <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center">
                                    <Clock size={12} className="text-amber-400" />
                                </div>
                                {formatWaktu(event.waktuMulai)} – {formatWaktu(event.waktuSelesai)} WIB
                            </div>
                        </div>
                    </div>

                    {/* Deskripsi */}
                    <div className="mb-8 p-5 bg-slate-900/60 border border-slate-800/60 rounded-2xl">
                        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                            Tentang Event
                        </h2>
                        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                            {event.deskripsi}
                        </p>
                    </div>

                    {/* ── Tiket Kategori Section ─────────────────────────── */}
                    <div>
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-7 h-7 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                                <Ticket size={14} className="text-amber-400" />
                            </div>
                            <h2 className="text-lg font-semibold text-slate-100">
                                Pilih Tiket
                            </h2>
                        </div>

                        {/* Belum login — info banner */}
                        {!isLoggedIn && (
                            <div className="mb-4 flex items-center gap-3 p-4 bg-amber-400/5 border border-amber-400/20 rounded-xl">
                                <span className="text-amber-400 text-lg">🔒</span>
                                <div>
                                    <p className="text-sm text-amber-300 font-medium">
                                        Login untuk membeli tiket
                                    </p>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        Daftar gratis atau masuk ke akunmu
                                    </p>
                                </div>
                                <button
                                    onClick={() => router.push('/login')}
                                    className="ml-auto px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 text-xs font-semibold hover:bg-amber-300 transition-colors shrink-0"
                                >
                                    Masuk
                                </button>
                            </div>
                        )}

                        {/* Event tidak tersedia */}
                        {event.status !== 'PUBLISHED' && (
                            <div className="p-5 bg-slate-900/60 border border-slate-800/60 rounded-2xl text-center">
                                <p className="text-slate-400 text-sm">
                                    {event.status === 'CANCELLED'
                                        ? 'Event ini telah dibatalkan'
                                        : 'Tiket belum tersedia untuk event ini'}
                                </p>
                            </div>
                        )}

                        {/* Loading kategori skeleton */}
                        {event.status === 'PUBLISHED' && isKategoriLoading && (
                            <div className="space-y-3">
                                {[1, 2].map((i) => (
                                    <div key={i} className="h-28 bg-slate-800 rounded-2xl animate-pulse" />
                                ))}
                            </div>
                        )}

                        {/* Empty kategori */}
                        {event.status === 'PUBLISHED' && !isKategoriLoading && (!kategoris || kategoris.length === 0) && (
                            <div className="p-5 bg-slate-900/60 border border-slate-800/60 rounded-2xl text-center">
                                <p className="text-slate-400 text-sm">
                                    Belum ada kategori tiket untuk event ini
                                </p>
                            </div>
                        )}

                        {/* List kategori */}
                        {event.status === 'PUBLISHED' && !isKategoriLoading && kategoris && kategoris.length > 0 && (
                            <div className="space-y-3">
                                {kategoris.map((kategori) => (
                                    <TiketKategoriCard
                                        key={kategori.id}
                                        kategori={kategori}
                                        isLoggedIn={isLoggedIn && !isAdmin}
                                        onBeli={setSelectedKategori}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Order modal */}
            {selectedKategori && (
                <OrderModal
                    kategori={selectedKategori}
                    onClose={() => setSelectedKategori(null)}
                />
            )}
        </>
    )
}