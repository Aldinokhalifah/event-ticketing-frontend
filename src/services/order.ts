import { apiClient } from "@/lib/api";
import { CreateOrderRequest } from "@/types/request/CreateOrderRequest";
import { OrderResponse } from "@/types/response/OrderResponse";

export const orderService = {
    getAll: () => apiClient<OrderResponse[]>('/orders'),
    getById: (id: string) => apiClient<OrderResponse>(`/orders/${id}`),
    createOrder: (data: CreateOrderRequest) => apiClient<OrderResponse>('/orders', {
        method: "POST",
        body: JSON.stringify(data),
    }),
    payOrder: (id: string) => apiClient<OrderResponse>(`/orders/${id}/pay`, {
        method: "PATCH",
    }),
    cancelOrder: (id: string) => apiClient<OrderResponse>(`/orders/${id}/cancel`, {
        method: "PATCH",
    }),
}