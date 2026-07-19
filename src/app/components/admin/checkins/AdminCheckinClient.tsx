'use client'

import { useState, useRef } from 'react'
import { QrCode, Search, XCircle, Ticket } from 'lucide-react'
import { useCheckinTiket } from '@/hooks/useTiket'
import { TiketResponse } from '@/types/response/TiketResponse'
import CheckinResult from './CheckinResult'

export default function AdminCheckinClient() {
    const [kodeInput, setKodeInput] = useState('')
    const [result, setResult] = useState<TiketResponse | null>(null)
    const [errorMsg, setErrorMsg] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)

    const { mutate: checkin, isPending } = useCheckinTiket()

    const handleCheckin = (kode?: string) => {
        const kodeFinal = (kode ?? kodeInput).trim()
        if (!kodeFinal) return

        setErrorMsg('')
        setResult(null)

        checkin(kodeFinal, {
            onSuccess: (data) => {
                setResult(data)
                setKodeInput('')
            },
            onError: (err) => {
                setErrorMsg(err.message || 'Tiket tidak ditemukan atau tidak valid')
                setKodeInput('')
                inputRef.current?.focus()
            },
        })
    }

    const handleReset = () => {
        setResult(null)
        setErrorMsg('')
        setKodeInput('')
        setTimeout(() => inputRef.current?.focus(), 100)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleCheckin()
    }

    return (
        <div className="max-w-lg mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                    <QrCode size={16} className="text-amber-400" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-white tracking-tight">
                        Check-in Tiket
                    </h1>
                    <p className="text-xs text-slate-500">
                        Masukkan kode tiket untuk validasi kehadiran
                    </p>
                </div>
            </div>

            {/* QR Placeholder — akan diisi scanner nanti */}
            <div className="relative bg-slate-900/60 border border-dashed border-slate-700/60 rounded-2xl p-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto">
                    <QrCode size={24} className="text-slate-500" />
                </div>
                <p className="text-slate-400 text-sm font-medium">QR Scanner</p>
                <p className="text-slate-500 text-xs">
                    Akan ditambahkan — gunakan input manual di bawah untuk sementara
                </p>
                {/* Corner decorations */}
                <div className="absolute top-4 left-4 w-5 h-5 border-l-2 border-t-2 border-amber-400/30 rounded-tl" />
                <div className="absolute top-4 right-4 w-5 h-5 border-r-2 border-t-2 border-amber-400/30 rounded-tr" />
                <div className="absolute bottom-4 left-4 w-5 h-5 border-l-2 border-b-2 border-amber-400/30 rounded-bl" />
                <div className="absolute bottom-4 right-4 w-5 h-5 border-r-2 border-b-2 border-amber-400/30 rounded-br" />
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-800" />
                <span className="text-xs text-slate-500">atau input manual</span>
                <div className="flex-1 h-px bg-slate-800" />
            </div>

            {/* Manual input */}
            {!result && (
                <div className="space-y-3">
                    <div className="relative">
                        <Ticket
                            size={15}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                        />
                        <input
                            ref={inputRef}
                            type="text"
                            value={kodeInput}
                            onChange={(e) => setKodeInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Masukkan kode tiket... (contoh: TKT-A1B2C3D4-...)"
                            autoFocus
                            className="w-full pl-9 pr-4 py-3 bg-slate-900 border border-slate-700/60 rounded-xl text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/50 transition-colors font-mono"
                        />
                    </div>

                    {/* Error */}
                    {errorMsg && (
                        <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                            <XCircle size={14} className="text-red-400 shrink-0" />
                            <p className="text-sm text-red-400">{errorMsg}</p>
                        </div>
                    )}

                    <button
                        onClick={() => handleCheckin()}
                        disabled={isPending || !kodeInput.trim()}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-sm font-semibold transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        {isPending ? (
                            <>
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                Memvalidasi...
                            </>
                        ) : (
                            <>
                                <Search size={15} />
                                Validasi Tiket
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Result */}
            {result && (
                <CheckinResult tiket={result} onReset={handleReset} />
            )}
        </div>
    )
}