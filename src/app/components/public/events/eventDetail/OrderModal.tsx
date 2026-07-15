'use client'

import { useState } from 'react'
import { X, Plus, Minus, Ticket, AlertCircle } from 'lucide-react'
import { OrderModalProps } from '@/types/OrderModalProps'
import { useCreateOrder } from '@/hooks/useOrder'
import { useRouter } from 'next/navigation'
import { formatHarga } from '@/utils/formatHarga'

export default function OrderModal({ kategori, onClose }: OrderModalProps) {
    const router = useRouter()
    const [jumlah, setJumlah] = useState(1)
    const { mutate: createOrder, isPending } = useCreateOrder()

    const sisaKuota = kategori.kuota - kategori.terjual
    const maxBeli = Math.min(sisaKuota, 10) // max 10 per order
    const totalHarga = kategori.harga * jumlah

    const handleKurang = () => setJumlah((prev) => Math.max(1, prev - 1))
    const handleTambah = () => setJumlah((prev) => Math.min(maxBeli, prev + 1))

    const handleOrder = () => {
        createOrder(
            {
                items: [
                    {
                        tiketKategoriId: kategori.id,
                        jumlah,
                    },
                ],
            },
            {
                onSuccess: () => {
                    onClose()
                    router.push('/orders')
                },
            }
        )
    }

    return (
        // Backdrop
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            {/* Modal */}
            <div className="w-full max-w-md bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                            <Ticket size={14} className="text-amber-400" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-slate-100">Pesan Tiket</h3>
                            <p className="text-xs text-slate-500">{kategori.nama}</p>
                        </div>
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
                    {/* Harga per tiket */}
                    <div className="flex items-center justify-between py-3 px-4 bg-slate-800/60 rounded-xl">
                        <span className="text-sm text-slate-400">Harga per tiket</span>
                        <span className="text-sm font-semibold text-slate-100">
                            {formatHarga(kategori.harga)}
                        </span>
                    </div>

                    {/* Jumlah tiket */}
                    <div>
                        <label className="text-sm font-medium text-slate-300 mb-3 block">
                            Jumlah Tiket
                        </label>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleKurang}
                                disabled={jumlah <= 1}
                                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <Minus size={14} />
                            </button>

                            <span className="w-12 text-center text-xl font-bold text-white">
                                {jumlah}
                            </span>

                            <button
                                onClick={handleTambah}
                                disabled={jumlah >= maxBeli}
                                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <Plus size={14} />
                            </button>

                            <span className="text-xs text-slate-500">
                                Maks. {maxBeli} tiket
                            </span>
                        </div>
                    </div>

                    {/* Info kuota tersisa */}
                    {sisaKuota <= 10 && (
                        <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2.5 rounded-xl">
                            <AlertCircle size={13} className="shrink-0" />
                            Hanya tersisa {sisaKuota} tiket — segera pesan!
                        </div>
                    )}

                    {/* Total */}
                    <div className="border-t border-slate-800 pt-4">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-slate-400">
                                {jumlah} tiket × {formatHarga(kategori.harga)}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-base font-semibold text-slate-200">Total</span>
                            <span className="text-xl font-bold text-white">
                                {formatHarga(totalHarga)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-5 pb-5 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-800 transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleOrder}
                        disabled={isPending}
                        className="flex-1 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        {isPending ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                Memproses...
                            </span>
                        ) : (
                            'Buat Order'
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}