import { apiClient } from "@/lib/api";
import { TiketResponse } from "@/types/response/TiketResponse";

export const tiketService = {
    getAll: () => apiClient<TiketResponse[]>('/tikets'),
    checkinTiket: (kodeTiket: string) => apiClient<TiketResponse>(`/tikets/checkin`, {
        method: 'PATCH',
        body: JSON.stringify(kodeTiket)
    })
}