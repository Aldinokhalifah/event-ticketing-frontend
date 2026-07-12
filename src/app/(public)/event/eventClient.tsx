// app/(public)/_components/HomeClient.tsx
'use client'

import { useMemo, useState } from 'react'
import { useGetAllEvent } from '@/hooks/useEvent'
import SearchBar from '@/app/components/public/events/SearchBar'
import EventCard from '@/app/components/public/events/EventCard'
import EventCardSkeleton from '@/app/components/public/events/EventCardSkeleton'
import { Ticket } from 'lucide-react'

export default function EventPageClient() {
    const [search, setSearch] = useState('')
    const { data: events, isPending, isError } = useGetAllEvent()

    // Filter di client — tidak perlu request baru
    const filtered = useMemo(() => {
        return events?.filter((event) =>
            event.status === 'PUBLISHED' &&
            event.nama.toLowerCase().includes(search.toLowerCase())
    ) ?? []
    }, [events, search])

    // Pisahkan featured (index 0) dan sisanya
    const [featured, ...rest] = filtered

    return (
        <div className="min-h-screen bg-slate-950">
            {/* ── Hero Section ─────────────────────────────────────────────── */}
            <section className="relative px-4 sm:px-6 pt-16 pb-12 max-w-7xl mx-auto">
                {/* Ambient glow background */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative text-center mb-10">
                    {/* Label kecil */}
                    <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-medium px-3 py-1.5 rounded-full mb-5">
                        <Ticket size={12} />
                        Platform Tiket Event Indonesia
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 tracking-tight">
                        Temukan Event{' '}
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-orange-400">
                            Favoritmu
                        </span>
                    </h1>
                    <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
                        Konser, festival, workshop, seminar — semua ada di sini.
                    </p>
                </div>

                {/* Search bar */}
                <div className="max-w-2xl mx-auto">
                    <SearchBar value={search} onChange={setSearch} />
                </div>
            </section>

            {/* ── Event Grid Section ───────────────────────────────────────── */}
            <section className="px-4 sm:px-6 pb-16 max-w-7xl mx-auto">
                {/* Section header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-100">
                            {search ? `Hasil pencarian "${search}"` : 'Semua Event'}
                        </h2>
                        {!isPending && (
                            <p className="text-sm text-slate-500 mt-0.5">
                                {filtered.length} event ditemukan
                            </p>
                        )}
                    </div>
                </div>

                {/* Error state */}
                {isError && (
                    <div className="text-center py-20">
                        <p className="text-slate-400 text-sm">Gagal memuat event. Coba refresh halaman.</p>
                    </div>
                )}

                {/* Loading state — skeleton */}
                {isPending && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
                        <div className="lg:col-span-2 lg:row-span-2">
                            <EventCardSkeleton featured />
                        </div>
                        {Array.from({ length: 4 }).map((_, i) => (
                            <EventCardSkeleton key={i} />
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!isPending && filtered.length === 0 && (
                    <div className="text-center py-24 space-y-3">
                        <div className="text-4xl">🎫</div>
                        <p className="text-slate-300 font-medium">
                            {search ? 'Tidak ada event yang cocok' : 'Belum ada event tersedia'}
                        </p>
                        <p className="text-slate-500 text-sm">
                            {search ? 'Coba kata kunci lain' : 'Pantau terus untuk update terbaru'}
                        </p>
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="mt-2 text-amber-400 text-sm hover:text-amber-300 transition-colors"
                            >
                                Tampilkan semua event
                            </button>
                        )}
                    </div>
                )}

                {/* Bento grid */}
                {!isPending && filtered.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[minmax(160px,auto)]">
                        {/* Featured card — span 2 kolom dan 2 baris */}
                        {featured && (
                            <div className="lg:col-span-2 lg:row-span-2">
                                <EventCard event={featured} featured />
                            </div>
                        )}

                        {/* Regular cards */}
                        {rest.map((event) => (
                            <div key={event.id}>
                                <EventCard event={event} />
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}