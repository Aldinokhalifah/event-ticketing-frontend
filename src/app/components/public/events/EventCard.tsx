// components/EventCard.tsx
'use client'

import Link from 'next/link'
import { MapPin, Calendar, Clock } from 'lucide-react'
import { getEventGradientStyle} from '@/utils/eventColor'
import { formatTanggal } from '@/utils/formatTanggal'
import { formatWaktu } from '@/utils/formatWaktu'
import StatusBadge from './StatusBadge'
import { EventCardProps } from '@/types/EventCardProps'

export default function EventCard({ event, featured = false }: EventCardProps) {
    const gradientStyle = getEventGradientStyle(event.id)

    if (featured) {
        return (
            <Link href={`/event/${event.id}`} className="block h-full group">
                <article className="relative h-full min-h-80 rounded-2xl overflow-hidden cursor-pointer">
                    {/* Gradient background */}
                    <div
                        className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                        style={gradientStyle}
                    />

                    {/* Noise texture overlay */}
                    <div className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
                        }}
                    />

                    {/* Dark gradient overlay bawah */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Content */}
                    <div className="relative h-full flex flex-col justify-between p-6">
                        {/* Top — badge */}
                        <div className="flex items-start justify-between">
                            <StatusBadge status={event.status} />
                            <span className="text-xs text-white/60 font-mono bg-black/20 backdrop-blur-sm px-2 py-1 rounded-lg">
                                FEATURED
                            </span>
                        </div>

                        {/* Bottom — info */}
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-3 leading-tight tracking-tight group-hover:text-amber-200 transition-colors duration-200">
                                {event.nama}
                            </h2>

                            <div className="flex flex-col gap-1.5 mb-4">
                                <div className="flex items-center gap-2 text-white/70 text-sm">
                                    <MapPin size={13} className="shrink-0" />
                                    <span className="truncate">{event.lokasi}</span>
                                </div>
                                <div className="flex items-center gap-2 text-white/70 text-sm">
                                    <Calendar size={13} className="shrink-0" />
                                    <span>{formatTanggal(event.tanggal)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-white/70 text-sm">
                                    <Clock size={13} className="shrink-0" />
                                    <span>{formatWaktu(event.waktuMulai)} – {formatWaktu(event.waktuSelesai)}</span>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-sm font-semibold px-4 py-2 rounded-xl transition-colors duration-200">
                                Lihat Tiket
                                <span className="text-base">→</span>
                            </div>
                        </div>
                    </div>
                </article>
            </Link>
        )
    }

    // ── Regular Card ──────────────────────────────────────────────────────────

    return (
        <Link href={`/event/${event.id}`} className="block h-full group">
            <article className="relative h-full min-h-40 rounded-2xl overflow-hidden cursor-pointer border border-slate-800/60 hover:border-slate-700/60 transition-colors duration-200">
                {/* Gradient background */}
                <div
                    className="absolute inset-0 opacity-60 transition-opacity duration-300 group-hover:opacity-80"
                    style={gradientStyle}
                />

                {/* Noise texture overlay */}
                <div className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
                    }}
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-black/10" />

                {/* Content */}
                <div className="relative h-full flex flex-col justify-between p-4">
                    {/* Badge */}
                    <div>
                        <StatusBadge status={event.status} />
                    </div>

                    {/* Info */}
                    <div>
                        <h3 className="text-base font-bold text-white mb-2 leading-tight group-hover:text-amber-200 transition-colors duration-200 line-clamp-2">
                            {event.nama}
                        </h3>

                        <div className="flex flex-col gap-1 mb-3">
                            <div className="flex items-center gap-1.5 text-white/65 text-xs">
                                <MapPin size={11} className="shrink-0" />
                                <span className="truncate">{event.lokasi}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-white/65 text-xs">
                                <Calendar size={11} className="shrink-0" />
                                <span>{formatTanggal(event.tanggal)}</span>
                            </div>
                        </div>

                        {/* CTA kecil */}
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 group-hover:text-amber-300 transition-colors">
                            Lihat detail
                            <span className="text-sm group-hover:translate-x-0.5 transition-transform duration-200 inline-block">→</span>
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    )
}