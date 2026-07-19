import { EventStatus } from "@/types/enum/EventStatus";

export const STATUS_FILTERS: { label: string; value: EventStatus | 'ALL' }[] = [
    { label: 'Semua', value: 'ALL' },
    { label: 'Draft', value: 'DRAFT' },
    { label: 'Published', value: 'PUBLISHED' },
    { label: 'Dibatalkan', value: 'CANCELLED' },
]