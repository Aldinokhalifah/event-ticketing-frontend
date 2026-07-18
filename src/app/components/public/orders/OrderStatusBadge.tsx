import { STATUS_CONFIG } from '@/utils/orderBadgeConfig'
import { OrderStatusBadgeProps } from '@/types/OrderStatusBadgeProps'


export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
    const config = STATUS_CONFIG[status]

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
                status === 'PAID'
                    ? 'bg-emerald-400'
                    : status === 'PENDING'
                    ? 'bg-yellow-400 animate-pulse'
                    : 'bg-red-400'
            }`} />
            {config.label}
        </span>
    )
}