import { TiketResponse } from "@/types/response/TiketResponse"
import { STATUS_CONFIG } from "@/utils/tiketBadgeConfig"
import { CheckCircle, Ticket, X, XCircle } from "lucide-react"

export default function TiketDetailModal({tiket,onClose,}: {tiket: TiketResponse, onClose: () => void}) {
    const config = STATUS_CONFIG[tiket.status]
    const StatusIcon = config.icon

    // Pisah kode tiket jadi bagian-bagian yang lebih readable
    const parts = tiket.kodeTiket.split('-')

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="w-full max-w-sm bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                        <Ticket size={16} className="text-amber-400" />
                        <h3 className="text-sm font-semibold text-slate-100">Detail Tiket</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 space-y-5">
                    {/* Kode tiket — display utama */}
                    <div className="text-center py-5 bg-slate-800/60 rounded-2xl border border-slate-700/40">
                        <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider">
                            Kode Tiket
                        </p>
                        {/* Tampilkan kode per bagian */}
                        <div className="flex items-center justify-center gap-1.5 flex-wrap px-4">
                            {parts.map((part, i) => (
                                <span key={i} className="flex items-center gap-1.5">
                                    <span className="font-mono text-sm font-bold text-amber-400 tracking-widest">
                                        {part}
                                    </span>
                                    {i < parts.length - 1 && (
                                        <span className="text-slate-600">-</span>
                                    )}
                                </span>
                            ))}
                        </div>
                        <p className="text-xs text-slate-500 mt-3">
                            Tunjukkan kode ini kepada petugas
                        </p>
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-between py-3 px-4 bg-slate-800/40 rounded-xl">
                        <span className="text-sm text-slate-400">Status</span>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.badgeClass}`}>
                            <StatusIcon size={11} />
                            {config.label}
                        </span>
                    </div>

                    {/* Info tambahan */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500">Tiket ID</span>
                            <span className="text-slate-400 font-mono">
                                {tiket.id.slice(0, 8).toUpperCase()}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500">Order Item ID</span>
                            <span className="text-slate-400 font-mono">
                                {tiket.orderItemId.slice(0, 8).toUpperCase()}
                            </span>
                        </div>
                    </div>

                    {/* Warning untuk USED */}
                    {tiket.status === 'USED' && (
                        <div className="flex items-center gap-2 p-3 bg-emerald-400/5 border border-emerald-400/20 rounded-xl">
                            <CheckCircle size={14} className="text-emerald-400 shrink-0" />
                            <p className="text-xs text-emerald-300">
                                Tiket ini sudah digunakan untuk masuk ke event.
                            </p>
                        </div>
                    )}

                    {tiket.status === 'CANCELLED' && (
                        <div className="flex items-center gap-2 p-3 bg-red-500/5 border border-red-500/20 rounded-xl">
                            <XCircle size={14} className="text-red-400 shrink-0" />
                            <p className="text-xs text-red-300">
                                Tiket ini dibatalkan karena order dibatalkan.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
