import { apiClient } from "@/lib/api";
import { CreateEventRequest } from "@/types/request/CreateEventRequest";
import { EventResponse } from "@/types/response/EventResponse";

export const eventService = {
    getAll: () => apiClient<EventResponse[]>('/events'),
    getById: (id: string) => apiClient<EventResponse>(`/events/${id}`),
    createEvent: (data: CreateEventRequest) => apiClient<EventResponse>('/events', {
        method: "POST",
        body: JSON.stringify(data),
    }),
    updateEvent: (id: string, data: CreateEventRequest) => apiClient<EventResponse>(`/events/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    }),
    publishEvent: (id: string) => apiClient<EventResponse>(`/events/${id}/publish`, {
        method: "PATCH",
    }),
    cancelEvent: (id: string) => apiClient<EventResponse>(`/events/${id}/cancel`, {
        method: "PATCH",
    }),
    deleteEvent: (id: string) => apiClient<void>(`/events/${id}`, {
        method: "DELETE",
    }),
};