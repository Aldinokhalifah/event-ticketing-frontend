'use client'

import { useState, useMemo } from 'react'
import { BarChart3, TrendingUp, Ticket, DollarSign } from 'lucide-react'
import { useGetAllEvent } from '@/hooks/useEvent'
import { useLaporanByEventId } from '@/hooks/useLaporan'
import { formatHarga } from '@/utils/formatHarga'
import EventSelector from './EventSelector'
import StatCard from './StatCard'

export default function AdminLaporanClient() {
    const [selectedEventId, setSelectedEventId] = useState('')

    const { data: events, isPending: isEventsLoading } = useGetAllEvent()
    const {
        data: laporan,
        isPending: isLaporanLoading,
        isError,
    } = useLaporanByEventId(selectedEventId || undefined)

    // Hitung persentase terjual per kategori untuk progress bar
    const maxTerjual = useMemo(
        () => Math.max(...(laporan?.rincianKategori?.map((k) => k.terjual) ?? [1])),
        [laporan]
    )

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                    <BarChart3 size={16} className="text-amber-400" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-white tracking-tight">
                        Laporan Penjualan
                    </h1>
                    <p className="text-xs text-slate-500">
                        Ringkasan penjualan tiket per event
                    </p>
                </div>
            </div>

            {/* Event selector */}
            <div className="max-w-md">
                <label className="block text-xs font-medium text-slate-400 mb-2">
                    Pilih Event
                </label>
                {isEventsLoading ? (
                    <div className="h-12 bg-slate-800 rounded-xl animate-pulse" />
                ) : (
                    <EventSelector
                        events={events ?? []}
                        selectedId={selectedEventId}
                        onSelect={setSelectedEventId}
                    />
                )}
            </div>

            {/* Placeholder — belum pilih event */}
            {!selectedEventId && (
                <div className="py-20 text-center space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto">
                        <BarChart3 size={24} className="text-slate-600" />
                    </div>
                    <p className="text-slate-400 font-medium">Pilih event untuk melihat laporan</p>
                    <p className="text-slate-500 text-sm">Hanya event dengan status Published yang tampil</p>
                </div>
            )}

            {/* Loading laporan */}
            {selectedEventId && isLaporanLoading && (
                <div className="space-y-4 animate-pulse">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-28 bg-slate-800 rounded-2xl" />
                        <div className="h-28 bg-slate-800 rounded-2xl" />
                    </div>
                    <div className="h-48 bg-slate-800 rounded-2xl" />
                </div>
            )}

            {/* Error */}
            {selectedEventId && isError && (
                <div className="py-12 text-center text-slate-400 text-sm">
                    Gagal memuat laporan. Coba pilih event lain.
                </div>
            )}

            {/* Laporan data */}
            {laporan && !isLaporanLoading && (
                <div className="space-y-6">
                    {/* Nama event */}
                    <div className="px-4 py-3 bg-slate-900/60 border border-slate-700/40 rounded-xl">
                        <p className="text-xs text-slate-500 mb-0.5">Event</p>
                        <p className="text-base font-semibold text-slate-100">
                            {laporan.namaEvent}
                        </p>
                    </div>

                    {/* Stat cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <StatCard
                            label="Total Tiket Terjual"
                            value={`${laporan.totalTiketTerjual} tiket`}
                            icon={Ticket}
                        />
                        <StatCard
                            label="Total Pendapatan"
                            value={formatHarga(laporan.totalPendapatan)}
                            icon={DollarSign}
                            accent
                        />
                    </div>

                    {/* Breakdown per kategori */}
                    <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-800">
                            <TrendingUp size={15} className="text-amber-400" />
                            <h2 className="text-sm font-semibold text-slate-100">
                                Breakdown per Kategori Tiket
                            </h2>
                        </div>

                        {/* Kategori list */}
                        {laporan.rincianKategori.length === 0 ? (
                            <div className="px-5 py-10 text-center text-slate-500 text-sm">
                                Belum ada penjualan untuk event ini
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-800/60">
                                {laporan.rincianKategori.map((kategori, index) => {
                                    const percentage = maxTerjual > 0
                                        ? (kategori.terjual / maxTerjual) * 100
                                        : 0

                                    return (
                                        <div key={index} className="px-5 py-4 space-y-3">
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-2.5 min-w-0">
                                                    <div className="w-7 h-7 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
                                                        <Ticket size={12} className="text-amber-400" />
                                                    </div>
                                                    <span className="text-sm font-medium text-slate-100 truncate">
                                                        {kategori.nama}
                                                    </span>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <p className="text-sm font-semibold text-white">
                                                        {formatHarga(kategori.pendapatan)}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {kategori.terjual} tiket terjual
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Progress bar */}
                                            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-amber-400 rounded-full transition-all duration-700"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}