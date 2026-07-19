import { ChatResponse } from "@/types/Agent";

export const agentService = {
    sendChat: async (message: string, conversation_history: Array<{role: string, content: string}> = []) => {
        const res = await fetch('/api/agent', {  
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, conversation_history })
        })
        if (!res.ok) throw new Error('AI Agent tidak tersedia')
        return res.json() as Promise<ChatResponse>
    }
}