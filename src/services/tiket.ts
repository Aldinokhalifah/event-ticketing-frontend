import { apiClient } from "@/lib/api";
import { TiketResponse } from "@/types/response/TiketResponse";

export const tiketService = {
    getAll: () => apiClient<TiketResponse[]>('/tikets'),
    checkinTiket: (id: string) => apiClient<TiketResponse>(`/tikets/${id}/checkin`, {
        method: 'PATCH'
    })
}