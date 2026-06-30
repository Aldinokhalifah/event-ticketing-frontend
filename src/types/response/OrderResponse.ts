import { OrderStatus } from "../enum/OrderStatus"
import { OrderItemResponse } from "./OrderItemResponse"

export interface OrderResponse {
    id: string,
    kodeOrder: string,
    tanggalOrder: string,
    totalHarga: number,
    status: OrderStatus,
    userId: string,
    items: OrderItemResponse[]
};