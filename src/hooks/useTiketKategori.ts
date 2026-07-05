import { tiketKategoriService } from "@/services/tiketKategori";
import { CreateTiketKategoriRequest } from "@/types/request/CreateTiketKategoriRequest";
import { TiketKategoriResponse } from "@/types/response/TiketKategoriResponse";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useGetAllTiketKategori(eventId?: string) {
    return useQuery<TiketKategoriResponse[]>({
        queryKey: ['tiket-kategori', eventId],
        queryFn: () => tiketKategoriService.getAll(eventId as string),
        enabled: !!eventId
    })
}

export function useCreateTiketKategori() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({eventId, data}: {eventId: string, data: CreateTiketKategoriRequest}) => 
            tiketKategoriService.createTiketKategori(eventId, data),
        onSuccess: ({eventId}) => {
            toast.success("Berhasil membuat kategori tiket");
            qc.invalidateQueries({queryKey: ['tiket-kategori', eventId]});
        },
        onError: (err) => {
            toast.error(err?.message || "Gagal membuat kategori tiket");
        }
    })
}

export function useUpdateTiketKategori() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({id, data}: {id: string, data: CreateTiketKategoriRequest}) => 
            tiketKategoriService.updateTiketKategori(id, data),
        onSuccess: () => {
            toast.success("Berhasil memperbarui kategori tiket");
            qc.invalidateQueries({queryKey: ['tiket-kategori']});
        },
        onError: (err) => {
            toast.error(err?.message || "Gagal memperbarui kategori tiket");
        }
    })
}

export function useDeleteTiketKategori() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => 
            tiketKategoriService.deleteTiketKategori(id),
        onSuccess: () => {
            toast.success("Berhasil menghapus kategori tiket");
            qc.invalidateQueries({queryKey: ['tiket-kategori']});
        },
        onError: (err) => {
            toast.error(err?.message || "Gagal menghapus kategori tiket");
        }
    })
}

