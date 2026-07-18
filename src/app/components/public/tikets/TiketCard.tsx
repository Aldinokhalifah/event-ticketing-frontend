'use client'

import { useState } from 'react'
import { Ticket } from 'lucide-react'
import { TiketCardProps } from '@/types/TiketCardProps'
import { STATUS_CONFIG } from '@/utils/tiketBadgeConfig'
import TiketDetailModal from './TiketDetailModal'

export default function TiketCard({ tiket }: TiketCardProps) {
    const [showDetail, setShowDetail] = useState(false)
    const config = STATUS_CONFIG[tiket.status]
    const StatusIcon = config.icon

    // Tampilkan hanya bagian pertama kode (TKT-XXXXXXXX)
    const kodeShort = tiket.kodeTiket.split('-').slice(0, 2).join('-').toUpperCase()

    return (
        <>
            <button
                onClick={() => setShowDetail(true)}
                className={`w-full text-left rounded-2xl border p-4 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] group ${config.cardClass}`}
            >
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        {/* Icon */}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            tiket.status === 'ACTIVE'
                                ? 'bg-amber-400/10 border border-amber-400/20'
                                : tiket.status === 'USED'
                                ? 'bg-emerald-400/10 border border-emerald-400/20'
                                : 'bg-slate-800 border border-slate-700'
                        }`}>
                            <Ticket size={16} className={
                                tiket.status === 'ACTIVE'
                                    ? 'text-amber-400'
                                    : tiket.status === 'USED'
                                    ? 'text-emerald-400'
                                    : 'text-slate-500'
                            } />
                        </div>

                        <div className="min-w-0">
                            {/* Kode tiket — short version */}
                            <p className="font-mono text-sm font-bold text-slate-100 tracking-wider truncate">
                                {kodeShort}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Tap untuk lihat detail
                            </p>
                        </div>
                    </div>

                    {/* Status badge */}
                    <div className="shrink-0">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.badgeClass}`}>
                            <StatusIcon size={10} />
                            {config.label}
                        </span>
                    </div>
                </div>
            </button>

            {/* Detail modal */}
            {showDetail && (
                <TiketDetailModal
                    tiket={tiket}
                    onClose={() => setShowDetail(false)}
                />
            )}
        </>
    )
}