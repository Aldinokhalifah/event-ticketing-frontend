'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Receipt, Ticket } from 'lucide-react'
import { usePayOrder, useCancelOrder } from '@/hooks/useOrder'
import OrderStatusBadge from './OrderStatusBadge'
import { formatHarga } from '@/utils/formatHarga'
import { formatTanggal } from '@/utils/formatTanggal'
import { OrderCardProps } from '@/types/OrderCardProps'

export default function OrderCard({ order }: OrderCardProps) {
    const [expanded, setExpanded] = useState(false)
    const { mutate: payOrder, isPending: isPaying } = usePayOrder()
    const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder()

    const handlePay = () => {
        payOrder({ id: order.id })
    }

    const handleCancel = () => {
        if (confirm('Batalkan order ini? Kuota tiket akan dikembalikan.')) {
            cancelOrder({ id: order.id })
        }
    }

    return (
        <div className={`bg-slate-900/80 border rounded-2xl overflow-hidden transition-colors duration-200 ${
            order.status === 'CANCELLED'
                ? 'border-slate-800/40 opacity-70'
                : 'border-slate-700/60'
        }`}>
            {/* ── Card Header ─────────────────────────────────────────────── */}
            <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                    {/* Kode order + tanggal */}
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                            <Receipt size={16} className="text-slate-400" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs text-slate-500 font-mono truncate">
                                #{order.kodeOrder.slice(0, 8).toUpperCase()}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                                {formatTanggal(order.tanggalOrder)}
                            </p>
                        </div>
                    </div>

                    <OrderStatusBadge status={order.status} />
                </div>

                {/* Total harga */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-slate-500 mb-0.5">Total Pembayaran</p>
                        <p className="text-xl font-bold text-white">
                            {formatHarga(order.totalHarga)}
                        </p>
                    </div>

                    {/* Jumlah item */}
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs bg-slate-800 px-3 py-1.5 rounded-lg">
                        <Ticket size={12} />
                        {order.items.reduce((acc, item) => acc + item.jumlah, 0)} tiket
                    </div>
                </div>

                {/* Action buttons — hanya saat PENDING */}
                {order.status === 'PENDING' && (
                    <div className="flex gap-2 mt-4 pt-4 border-t border-slate-800">
                        <button
                            onClick={handlePay}
                            disabled={isPaying}
                            className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100"
                        >
                            {isPaying ? 'Memproses...' : 'Bayar Sekarang'}
                        </button>
                        <button
                            onClick={handleCancel}
                            disabled={isCancelling}
                            className="flex-1 py-2.5 rounded-xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium transition-colors disabled:opacity-60"
                        >
                            {isCancelling ? 'Membatalkan...' : 'Batalkan'}
                        </button>
                    </div>
                )}
            </div>

            {/* ── Expandable Items ─────────────────────────────────────────── */}
            <div>
                {/* Toggle */}
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="w-full flex items-center justify-between px-5 py-3 border-t border-slate-800 text-xs text-slate-500 hover:text-slate-300 hover:bg-slate-800/40 transition-colors"
                >
                    <span>Detail item ({order.items.length})</span>
                    {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {/* Item list */}
                {expanded && (
                    <div className="px-5 pb-4 space-y-2 border-t border-slate-800/60">
                        {order.items.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between py-2.5 border-b border-slate-800/40 last:border-0"
                            >
                                <div className="flex items-center gap-2.5">
                                    <div className="w-6 h-6 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                                        <Ticket size={11} className="text-amber-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-300">
                                            {item.jumlah}x tiket
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {formatHarga(item.hargaSatuan)} / tiket
                                        </p>
                                    </div>
                                </div>
                                <p className="text-xs font-semibold text-slate-200">
                                    {formatHarga(item.hargaSatuan * item.jumlah)}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}