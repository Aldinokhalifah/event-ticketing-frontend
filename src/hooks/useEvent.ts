import { eventService } from "@/services/event";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateEventRequest } from "@/types/request/CreateEventRequest";
import { EventResponse } from "@/types/response/EventResponse";
import toast from "react-hot-toast";

export function useGetAllEvent() {
    return useQuery<EventResponse[]>({
        queryKey: ["events"],
        queryFn: () => eventService.getAll(),
        staleTime: 10000,
        gcTime: 30000
    });
}

export function useGetEvent(id?: string) {
    return useQuery<EventResponse>({
        queryKey: ["events", id],
        queryFn: () => eventService.getById(id as string),
        enabled: !!id,
        staleTime: 10000,
        gcTime: 30000
    });
}

export function useCreateEvent() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateEventRequest) => eventService.createEvent(data),
        onSuccess: () => {
            toast.success("Berhasil menambahkan event baru");
            qc.invalidateQueries({ queryKey: ["events"] });
        },
        onError: (error) => {
            toast.error(error?.message || 'Gagal menambahkan event baru');
        }
    });
}

export function useUpdateEvent() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: CreateEventRequest }) =>
            eventService.updateEvent(id, data),
        onSuccess: () => {
            toast.success("Berhasil memperbarui event");
            qc.invalidateQueries({ queryKey: ["events"] });
        },
        onError: (error) => {
            toast.error(error?.message || 'Gagal memperbarui event');
        }
    });
}

export function usePublishEvent() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => eventService.publishEvent(id),
        onSuccess: () => {
            toast.success("Berhasil mempublikasikan event");
            qc.invalidateQueries({ queryKey: ["events"] });
        },
        onError: (error) => {
            toast.error(error?.message || 'Gagal mempublikasikan event');
        }
    });
}

export function useCancelEvent() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => eventService.cancelEvent(id),
        onSuccess: () => {
            toast.success("Berhasil membatalkan event");
            qc.invalidateQueries({ queryKey: ["events"] });
        },
        onError: (error) => {
            toast.error(error?.message || 'Gagal membatalkan event');
        }
    });
}

export function useDeleteEvent() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => eventService.deleteEvent(id),
        onSuccess: () => {
            toast.success("Berhasil menghapus event");
            qc.invalidateQueries({ queryKey: ["events"] });
        },
        onError: (error) => {
            toast.error(error?.message || 'Gagal menghapus event');
        }
    });
}