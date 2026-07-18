import { OrderStatus } from "@/types/enum/OrderStatus";

export const STATUS_FILTERS: { label: string; value: OrderStatus | 'ALL' }[] = [
    { label: 'Semua', value: 'ALL' },
    { label: 'Menunggu', value: 'PENDING' },
    { label: 'Lunas', value: 'PAID' },
    { label: 'Dibatalkan', value: 'CANCELLED' },
]
