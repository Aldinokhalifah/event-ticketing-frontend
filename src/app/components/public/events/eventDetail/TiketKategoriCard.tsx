'use client'

import { Users, Ticket } from 'lucide-react'
import { formatHarga } from '@/utils/formatHarga'
import { TiketKategoriCardProps } from '@/types/TiketKategoriCardProps'

export default function TiketKategoriCard({kategori,onBeli,isLoggedIn = false,}: TiketKategoriCardProps) {
    const sisaKuota = kategori.kuota - kategori.terjual
    const isHabis = sisaKuota <= 0
    const isAlmostHabis = sisaKuota > 0 && sisaKuota <= 10

    return (
        <div className={`relative rounded-2xl border p-5 transition-colors duration-200
            ${isHabis
                ? 'bg-slate-900/40 border-slate-800/40 opacity-60'
                : 'bg-slate-900/80 border-slate-700/60 hover:border-slate-600/60'
            }`}
        >
            {isHabis && (
                <div className="absolute top-3 right-3">
                    <span className="text-xs font-medium bg-slate-700 text-slate-400 px-2.5 py-1 rounded-full">
                        Habis Terjual
                    </span>
                </div>
            )}

            {isAlmostHabis && (
                <div className="absolute top-3 right-3">
                    <span className="text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-full animate-pulse">
                        Sisa {sisaKuota} tiket
                    </span>
                </div>
            )}

            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
                            <Ticket size={15} className="text-amber-400" />
                        </div>
                        <h3 className="font-semibold text-slate-100 truncate">
                            {kategori.nama}
                        </h3>
                    </div>

                    <p className="text-2xl font-bold text-white mb-3 tracking-tight">
                        {formatHarga(kategori.harga)}
                    </p>

                    <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                        <Users size={12} />
                        <span>{kategori.terjual} / {kategori.kuota} terjual</span>
                    </div>

                    {/* Progress bar kuota */}
                    <div className="mt-3 h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${
                                isHabis ? 'bg-slate-600' : isAlmostHabis ? 'bg-red-400' : 'bg-amber-400'
                            }`}
                            style={{ width: `${Math.min((kategori.terjual / kategori.kuota) * 100, 100)}%` }}
                        />
                    </div>
                </div>

                <div className="shrink-0 mt-1">
                    {!isHabis && (
                        <button
                            onClick={() => onBeli?.(kategori)}
                            disabled={!isLoggedIn}
                            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                                ${isLoggedIn
                                    ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 hover:scale-105 active:scale-95'
                                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                }`}
                            title={!isLoggedIn ? 'Login untuk membeli tiket' : undefined}
                        >
                            {isLoggedIn ? 'Beli' : 'Login dulu'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}