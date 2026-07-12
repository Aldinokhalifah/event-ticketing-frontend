import { StatusBadgeProps } from '@/types/StatusBadgeProps';
import { STATUS_CONFIG } from '@/utils/statusBadgeConfig';

export default function StatusBadge({ status }: StatusBadgeProps) {
    const config = STATUS_CONFIG[status]

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}>
            {/* Dot indicator */}
            <span
                className={`w-1.5 h-1.5 rounded-full ${
                    status === 'PUBLISHED'
                        ? 'bg-green-400 animate-pulse'
                        : status === 'CANCELLED'
                        ? 'bg-red-400'
                        : 'bg-slate-400'
                }`}
            />
            {config.label}
        </span>
    )
}