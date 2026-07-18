import { TiketStatus } from "@/types/enum/TiketStatus";

export const STATUS_FILTERS: { label: string; value: TiketStatus | 'ALL' }[] = [
    { label: 'Semua', value: 'ALL' },
    { label: 'Aktif', value: 'ACTIVE' },
    { label: 'Terpakai', value: 'USED' },
    { label: 'Dibatalkan', value: 'CANCELLED' },
]