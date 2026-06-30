import { EventStatus } from "../enum/EventStatus"

export interface EventResponse {
    id: string,
    nama: string,
    deskripsi: string,
    lokasi: string,
    tanggal: string,
    waktuMulai: string,
    waktuSelesai: string,
    status: EventStatus
};