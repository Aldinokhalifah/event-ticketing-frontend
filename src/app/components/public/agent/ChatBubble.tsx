'use client'

import React, { memo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ChatBubbleProps } from '@/types/ChatBubbleProps'

const markdownComponents = {
    p: ({ children }: { children: React.ReactNode }) => (
        <p className="mb-1 last:mb-0">{children}</p>
    ),
    ul: ({ children }: { children: React.ReactNode }) => (
        <ul className="list-disc pl-5 mb-1 space-y-0.5">{children}</ul>
    ),
    ol: ({ children }: { children: React.ReactNode }) => (
        <ol className="list-decimal pl-5 mb-1 space-y-0.5">{children}</ol>
    ),
    li: ({ children }: { children: React.ReactNode }) => (
        <li className="text-sm">{children}</li>
    ),
    strong: ({ children }: { children: React.ReactNode }) => (
        <strong className="font-semibold">{children}</strong>
    ),
    code: ({ inline, children }: { inline?: boolean; children: React.ReactNode }) =>
        inline ? (
            <code className="bg-gray-200 px-1 py-0.5 rounded text-xs font-mono">
                {children}
            </code>
        ) : (
            <pre className="bg-gray-900 text-gray-100 p-3 rounded-xl overflow-x-auto text-xs leading-relaxed my-2">
                <code className="font-mono">{children}</code>
            </pre>
        ),
    table: ({ children }: { children: React.ReactNode }) => (
        <div className="overflow-x-auto my-2 rounded-xl border border-gray-200 bg-white">
            <table className="min-w-full border-collapse text-sm">{children}</table>
        </div>
    ),
    thead: ({ children }: { children: React.ReactNode }) => (
        <thead className="bg-gray-50 text-gray-700">{children}</thead>
    ),
    tbody: ({ children }: { children: React.ReactNode }) => (
        <tbody className="divide-y divide-gray-200">{children}</tbody>
    ),
    tr: ({ children }: { children: React.ReactNode }) => (
        <tr className="align-top">{children}</tr>
    ),
    th: ({ children }: { children: React.ReactNode }) => (
        <th className="border-b border-gray-200 px-3 py-2 text-left font-semibold whitespace-nowrap">
            {children}
        </th>
    ),
    td: ({ children }: { children: React.ReactNode }) => (
        <td className="border-b border-gray-200 px-3 py-2 align-top whitespace-normal wrap-words">
            {children}
        </td>
    ),
}

function ChatBubble({ message }: ChatBubbleProps) {
    const isUser = message.role === 'user'

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            {!isUser && (
                <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center shrink-0 mt-1 mr-2">
                    <span className="text-white text-xs">🤖</span>
                </div>
            )}
            <div
                className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    isUser
                        ? 'bg-yellow-600 text-white rounded-tr-sm'
                        : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                }`}
            >
                {isUser ? (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                ) : (
                    <div className="max-w-none overflow-x-auto">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={markdownComponents}
                        >
                            {message.content}
                        </ReactMarkdown>
                    </div>
                )}
            </div>
        </div>
    )
}

export default memo(ChatBubble)