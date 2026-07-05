import { laporanService } from "@/services/laporan";
import { LaporanResponse } from "@/types/response/LaporanResponse";
import { useQuery } from "@tanstack/react-query";

export function useLaporanByEventId(eventId?: string) {
    return useQuery<LaporanResponse>({
        queryKey: ['laporan', eventId],
        queryFn: () => laporanService.getByEventId(eventId as string),
        enabled: !!eventId
    })
}