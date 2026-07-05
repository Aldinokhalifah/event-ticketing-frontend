import { apiClient } from "@/lib/api";
import { LaporanResponse } from "@/types/response/LaporanResponse";

export const laporanService = {
    getByEventId: (eventId: string) => apiClient<LaporanResponse>(`/laporan/events/${eventId}`)
}