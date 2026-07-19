import { useState, useCallback } from 'react'
import { agentService } from '@/services/agent'
import toast from 'react-hot-toast'
import { Message } from '@/types/Agent'

const WELCOME_MESSAGE: Message = {
    role: 'assistant',
    content:
        'Halo! Aku asisten event ticketing kamu 👋\n\nAku bisa membantu:\n• Cari event yang tersedia\n• Cek ketersediaan tiket\n• Buat order tiket\n• Cek status order',
}

export const useAgent = () => {
    const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE])
    const [isLoading, setIsLoading] = useState(false)

    const sendMessage = useCallback(
        async (message: string) => {
            if (!message.trim() || isLoading) return

            const userMessage: Message = { role: 'user', content: message }

            // Simpan current messages SEBELUM setState
            let currentMessages: Message[] = []
            setMessages((prev) => {
                currentMessages = [...prev, userMessage]
                return currentMessages
            })

            setIsLoading(true)

            try {
                // Beri sedikit delay agar setState selesai
                await new Promise((resolve) => setTimeout(resolve, 0))

                // Build history dari currentMessages — skip welcome message
                const history = currentMessages
                    .slice(1)
                    .map((m) => ({ role: m.role, content: m.content }))

                // sendChat terima string message + array history secara terpisah
                const result = await agentService.sendChat(message, history)

                const assistantMessage: Message = {
                    role: 'assistant',
                    content: result.response,
                }

                setMessages((prev) => [...prev, assistantMessage])
            } catch {
                toast.error('AI Agent tidak tersedia, coba lagi nanti')
                // Rollback pesan user kalau error
                setMessages((prev) => prev.slice(0, -1))
            } finally {
                setIsLoading(false)
            }
        },
        [isLoading]
    )

    const clearMessages = useCallback(() => {
        setMessages([WELCOME_MESSAGE])
    }, [])

    return { messages, isLoading, sendMessage, clearMessages }
}