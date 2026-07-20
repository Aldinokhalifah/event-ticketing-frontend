import { EventResponse } from "./response/EventResponse"

export interface EventFormModalProps {
    event?: EventResponse       // kalau ada → mode edit, kalau tidak → mode create
    onClose: () => void
}