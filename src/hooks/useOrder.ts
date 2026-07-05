import { orderService } from "@/services/order";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateOrderRequest } from "@/types/request/CreateOrderRequest";
import { OrderResponse } from "@/types/response/OrderResponse";
import toast from "react-hot-toast";

export function useGetAllOrder() {
    return useQuery<OrderResponse[]>({
        queryKey: ["orders"],
        queryFn: () => orderService.getAll(),
    });
}

export function useGetOrder(id?: string) {
    return useQuery<OrderResponse>({
        queryKey: ["orders", id],
        queryFn: () => orderService.getById(id as string),
        enabled: !!id,
    });
}

export function useCreateOrder() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateOrderRequest) => orderService.createOrder(data),
        onSuccess: () => {
            toast.success("Order berhasil dibuat");
            qc.invalidateQueries({ queryKey: ["orders"] });
        },
        onError: (err: unknown) => {
            const message = err instanceof Error ? err.message : String(err);
            toast.error(message || "Gagal membuat order");
        },
    });
}

export function usePayOrder() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id}: { id: string; }) =>
            orderService.payOrder(id),
        onSuccess: () => {
            toast.success("Order berhasil dibayar");
            qc.invalidateQueries({ queryKey: ["orders"] });
        },
        onError: (err: unknown) => {
            const message = err instanceof Error ? err.message : String(err);
            toast.error(message || "Gagal membayar order");
        },
    });
}

export function useCancelOrder() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id}: { id: string; }) =>
            orderService.cancelOrder(id),
        onSuccess: () => {
            toast.success("Order berhasil dibatalkan");
            qc.invalidateQueries({ queryKey: ["orders"] });
        },
        onError: (err: unknown) => {
            const message = err instanceof Error ? err.message : String(err);
            toast.error(message || "Gagal membatalkan order");
        },
    });
}
