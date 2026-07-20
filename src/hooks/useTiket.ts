import { tiketService } from "@/services/tiket";
import { TiketResponse } from "@/types/response/TiketResponse";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useGetAllTiket() {
    return useQuery<TiketResponse[]>({
        queryKey: ['tiket'],
        queryFn: () => tiketService.getAll(),
    })
}

export function useCheckinTiket() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (kodeTiket: string) => tiketService.checkinTiket(kodeTiket),
        onSuccess: () => {
            toast.success("Berhasil checkin tiket");
            qc.invalidateQueries({queryKey: ['tiket']})
        },
        onError: (err) => {
            toast.error(err.message || "Gagal checkin tiket");
        }
    })
}