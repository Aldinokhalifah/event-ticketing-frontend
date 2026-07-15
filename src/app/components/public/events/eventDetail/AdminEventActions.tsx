'use client'

import { useRouter } from 'next/navigation'
import { Pencil, Globe, XCircle, Trash2 } from 'lucide-react'
import { EventResponse } from '@/types/response/EventResponse'
import { usePublishEvent, useCancelEvent, useDeleteEvent } from '@/hooks/useEvent'

interface AdminEventActionsProps {
    event: EventResponse
}

export default function AdminEventActions({ event }: AdminEventActionsProps) {
    const router = useRouter()
    const { mutate: publishEvent, isPending: isPublishing } = usePublishEvent()
    const { mutate: cancelEvent, isPending: isCancelling } = useCancelEvent()
    const { mutate: deleteEvent, isPending: isDeleting } = useDeleteEvent()

    const handlePublish = () => {
        publishEvent(event.id)
    }

    const handleCancel = () => {
        if (confirm(`Batalkan event "${event.nama}"? Tindakan ini tidak bisa diurungkan.`)) {
            cancelEvent(event.id)
        }
    }

    const handleDelete = () => {
        if (confirm(`Hapus event "${event.nama}"? Tindakan ini tidak bisa diurungkan.`)) {
            deleteEvent(event.id, {
                onSuccess: () => router.push('/admin/events'),
            })
        }
    }

    const handleEdit = () => {
        router.push(`/admin/events/${event.id}/edit`)
    }

    return (
        <div className="flex flex-wrap items-center gap-2">
            {/* Edit — hanya saat DRAFT */}
            {event.status === 'DRAFT' && (
                <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-sm font-medium transition-colors"
                >
                    <Pencil size={14} />
                    Edit
                </button>
            )}

            {/* Publish — hanya saat DRAFT */}
            {event.status === 'DRAFT' && (
                <button
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-sm font-semibold transition-colors disabled:opacity-60"
                >
                    <Globe size={14} />
                    {isPublishing ? 'Mempublikasikan...' : 'Publikasikan'}
                </button>
            )}

            {/* Cancel — saat DRAFT atau PUBLISHED */}
            {(event.status === 'DRAFT' || event.status === 'PUBLISHED') && (
                <button
                    onClick={handleCancel}
                    disabled={isCancelling}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-sm font-medium transition-colors disabled:opacity-60"
                >
                    <XCircle size={14} />
                    {isCancelling ? 'Membatalkan...' : 'Batalkan Event'}
                </button>
            )}

            {/* Delete — hanya saat DRAFT */}
            {event.status === 'DRAFT' && (
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-sm font-medium transition-colors disabled:opacity-60"
                >
                    <Trash2 size={14} />
                    {isDeleting ? 'Menghapus...' : 'Hapus'}
                </button>
            )}
        </div>
    )
}