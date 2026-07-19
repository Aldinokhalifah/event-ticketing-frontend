import { Message } from "./Agent"

export interface ChatWindowProps {
    onClose: () => void
    messages: Message[]
    isLoading: boolean
    onSend: (message: string) => void
    onClear: () => void
}
