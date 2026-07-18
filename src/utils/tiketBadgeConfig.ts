import { TiketStatus } from "@/types/enum/TiketStatus"
import { CheckCircle, Clock, XCircle } from "lucide-react"

export const STATUS_CONFIG: Record<TiketStatus, {
    label: string
    icon: React.ElementType
    cardClass: string
    badgeClass: string
}> = {
    ACTIVE: {
        label: 'Aktif',
        icon: Clock,
        cardClass: 'border-amber-400/20 bg-slate-900/80',
        badgeClass: 'bg-amber-400/10 text-amber-400 border border-amber-400/20',
    },
    USED: {
        label: 'Sudah Dipakai',
        icon: CheckCircle,
        cardClass: 'border-emerald-400/20 bg-slate-900/60 opacity-80',
        badgeClass: 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20',
    },
    CANCELLED: {
        label: 'Dibatalkan',
        icon: XCircle,
        cardClass: 'border-slate-800/40 bg-slate-900/40 opacity-60',
        badgeClass: 'bg-slate-700/80 text-slate-400 border border-slate-700',
    },
}