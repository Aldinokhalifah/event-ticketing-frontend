export interface ChatMessage {
    role: 'user' | 'assistant'
    content: string
}

export interface SendChatMessageParams {
    message: string
    conversation_history?: ChatMessage[]
}

export interface ChatResponse {
    response: string
    actions_taken: string[]
}

export interface Message {
    role: 'user' | 'assistant'
    content: string
}
