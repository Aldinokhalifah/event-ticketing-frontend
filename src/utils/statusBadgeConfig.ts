import { EventStatus } from "@/types/enum/EventStatus";

export const STATUS_CONFIG: Record<EventStatus, { label: string; className: string }> = {
    DRAFT: {
        label: 'Draft',
        className: 'bg-slate-700/80 text-slate-300 border border-slate-600/50',
    },
    PUBLISHED: {
        label: 'Tersedia',
        className: 'bg-green-400/10 text-green-400 border border-green-400/20',
    },
    CANCELLED: {
        label: 'Dibatalkan',
        className: 'bg-red-500/10 text-red-400 border border-red-500/20',
    },
}