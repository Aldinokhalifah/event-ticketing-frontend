import { OrderItemRequest } from "./OrderItemRequest"

export interface CreateOrderRequest {
    items: OrderItemRequest[]
}