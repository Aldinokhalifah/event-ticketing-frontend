import { KategoriSummaryResponse } from "./KategoriSummaryResponse"

export interface LaporanResponse {
    eventId: string,
    namaEvent: string,
    totalTiketTerjual: number,
    totalPendapatan: number,
    rincianKategori: KategoriSummaryResponse[]
};