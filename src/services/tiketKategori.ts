import { apiClient } from "@/lib/api";
import { CreateTiketKategoriRequest } from "@/types/request/CreateTiketKategoriRequest";
import { TiketKategoriResponse } from "@/types/response/TiketKategoriResponse";

export const tiketKategoriService = {
    getAll: (eventId: string) => apiClient<TiketKategoriResponse[]>(`/events/${eventId}/tiket-kategori`),
    createTiketKategori: (eventId: string, data: CreateTiketKategoriRequest) => apiClient<TiketKategoriResponse>(`/events/${eventId}/tiket-kategori`, {
        method: "POST",
        body: JSON.stringify(data),
    }),
    updateTiketKategori: (id: string, data: CreateTiketKategoriRequest) => apiClient<TiketKategoriResponse>(`/tiket-kategori/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    }),
    deleteTiketKategori: (id: string) => apiClient<void>(`/tiket-kategori/${id}`, {
        method: "DELETE",
    }),
};