'use client'

import { useState, useMemo } from 'react'
import { Plus, CalendarDays, Search } from 'lucide-react'
import { useGetAllEvent} from '@/hooks/useEvent'
import { EventResponse } from '@/types/response/EventResponse'
import { EventStatus } from '@/types/enum/EventStatus'
import StatusBadge from '../../public/events/StatusBadge'
import EventFormModal from './EventFormModal'
import { formatTanggal } from '@/utils/formatTanggal'
import TableSkeleton from './TableSkeleton'
import EventRowActions from './EventRowAction'
import { STATUS_FILTERS } from '@/utils/eventStatusFilter'

export default function AdminEventsClient() {
    const { data: events, isPending, isError } = useGetAllEvent()

    const [showModal, setShowModal] = useState(false)
    const [editTarget, setEditTarget] = useState<EventResponse | undefined>(undefined)
    const [search, setSearch] = useState('')
    const [activeFilter, setActiveFilter] = useState<EventStatus | 'ALL'>('ALL')

    const filtered = useMemo(
        () =>
            events?.filter(
                (event) =>
                    (activeFilter === 'ALL' || event.status === activeFilter) &&
                    event.nama.toLowerCase().includes(search.toLowerCase())
            ) ?? [],
        [events, search, activeFilter]
    )

    const handleOpenCreate = () => {
        setEditTarget(undefined)
        setShowModal(true)
    }

    const handleOpenEdit = (event: EventResponse) => {
        setEditTarget(event)
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
        setEditTarget(undefined)
    }

    return (
        <>
            <div className="space-y-6">
                {/* ── Page Header ─────────────────────────────────────────── */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                            <CalendarDays size={16} className="text-amber-400" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-tight">
                                Kelola Event
                            </h1>
                            {!isPending && (
                                <p className="text-xs text-slate-500">
                                    {events?.length ?? 0} event total
                                </p>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={handleOpenCreate}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <Plus size={15} />
                        Buat Event
                    </button>
                </div>

                {/* ── Toolbar — search + filter ───────────────────────────── */}
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search
                            size={15}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                        />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari nama event..."
                            className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-700/60 rounded-xl text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400/40 transition-colors"
                        />
                    </div>

                    {/* Status filter */}
                    <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
                        {STATUS_FILTERS.map((f) => (
                            <button
                                key={f.value}
                                onClick={() => setActiveFilter(f.value)}
                                className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
                                    activeFilter === f.value
                                        ? 'bg-amber-400 text-slate-950'
                                        : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-slate-700/60'
                                }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Table ───────────────────────────────────────────────── */}
                <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl overflow-hidden">
                    {/* Table header */}
                    <div className="hidden sm:grid grid-cols-[1fr_140px_100px_120px_120px] gap-4 px-5 py-3 border-b border-slate-800 text-xs font-medium text-slate-500 uppercase tracking-wider">
                        <span>Nama Event</span>
                        <span>Tanggal</span>
                        <span>Lokasi</span>
                        <span>Status</span>
                        <span>Aksi</span>
                    </div>

                    {/* Loading */}
                    {isPending && <TableSkeleton />}

                    {/* Error */}
                    {isError && (
                        <div className="px-5 py-12 text-center text-slate-400 text-sm">
                            Gagal memuat data event.
                        </div>
                    )}

                    {/* Empty */}
                    {!isPending && filtered.length === 0 && (
                        <div className="px-5 py-16 text-center space-y-2">
                            <p className="text-slate-300 font-medium">
                                {search || activeFilter !== 'ALL'
                                    ? 'Tidak ada event yang sesuai'
                                    : 'Belum ada event'}
                            </p>
                            <p className="text-slate-500 text-sm">
                                {!search && activeFilter === 'ALL' && 'Klik "Buat Event" untuk memulai'}
                            </p>
                        </div>
                    )}

                    {/* Rows */}
                    {!isPending && filtered.length > 0 && (
                        <div className="divide-y divide-slate-800/60">
                            {filtered.map((event) => (
                                <div
                                    key={event.id}
                                    className="grid grid-cols-1 sm:grid-cols-[1fr_140px_100px_120px_120px] gap-2 sm:gap-4 px-5 py-4 hover:bg-slate-800/30 transition-colors items-center"
                                >
                                    {/* Nama */}
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-slate-100 truncate">
                                            {event.nama}
                                        </p>
                                        {/* Mobile — tampilkan info tambahan */}
                                        <div className="sm:hidden flex flex-wrap gap-x-3 mt-1">
                                            <span className="text-xs text-slate-500">
                                                {formatTanggal(event.tanggal)}
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                {event.lokasi}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Tanggal — desktop only */}
                                    <span className="hidden sm:block text-sm text-slate-400">
                                        {formatTanggal(event.tanggal)}
                                    </span>

                                    {/* Lokasi — desktop only */}
                                    <span className="hidden sm:block text-sm text-slate-400 truncate">
                                        {event.lokasi}
                                    </span>

                                    {/* Status */}
                                    <div>
                                        <StatusBadge status={event.status} />
                                    </div>

                                    {/* Actions */}
                                    <EventRowActions
                                        event={event}
                                        onEdit={handleOpenEdit}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <EventFormModal
                    event={editTarget}
                    onClose={handleCloseModal}
                />
            )}
        </>
    )
}