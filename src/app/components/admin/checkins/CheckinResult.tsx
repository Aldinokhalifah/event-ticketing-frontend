import { TiketResponse } from "@/types/response/TiketResponse"
import { CheckCircle, XCircle } from "lucide-react"

export default function CheckinResult({tiket, onReset, }: { tiket: TiketResponse, onReset: () => void }) {
    const isSuccess = tiket.status === 'USED'

    return (
        <div className={`rounded-2xl border p-6 text-center space-y-4 ${
            isSuccess
                ? 'bg-emerald-400/5 border-emerald-400/20'
                : 'bg-red-500/5 border-red-500/20'
        }`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
                isSuccess ? 'bg-emerald-400/10' : 'bg-red-500/10'
            }`}>
                {isSuccess
                    ? <CheckCircle size={32} className="text-emerald-400" />
                    : <XCircle size={32} className="text-red-400" />
                }
            </div>

            <div>
                <p className={`text-lg font-bold mb-1 ${
                    isSuccess ? 'text-emerald-400' : 'text-red-400'
                }`}>
                    {isSuccess ? 'Check-in Berhasil!' : 'Tiket Tidak Valid'}
                </p>
                <p className="text-slate-400 text-sm">
                    {isSuccess
                        ? 'Peserta diperbolehkan masuk'
                        : `Status tiket: ${tiket.status}`}
                </p>
            </div>

            {/* Info tiket */}
            <div className="bg-slate-800/60 rounded-xl p-4 text-left space-y-2">
                <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Kode Tiket</span>
                    <span className="text-slate-300 font-mono">
                        {tiket.kodeTiket.slice(0, 16).toUpperCase()}...
                    </span>
                </div>
                <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Tiket ID</span>
                    <span className="text-slate-300 font-mono">
                        {tiket.id.slice(0, 8).toUpperCase()}
                    </span>
                </div>
            </div>

            <button
                onClick={onReset}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-sm font-medium transition-colors"
            >
                Scan Tiket Berikutnya
            </button>
        </div>
    )
}