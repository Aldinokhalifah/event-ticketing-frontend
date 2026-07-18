import { OrderStatus } from "@/types/enum/OrderStatus";

export const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
    PENDING: {
        label: 'Menunggu Pembayaran',
        className: 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20',
    },
    PAID: {
        label: 'Lunas',
        className: 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20',
    },
    CANCELLED: {
        label: 'Dibatalkan',
        className: 'bg-red-500/10 text-red-400 border border-red-500/20',
    },
}