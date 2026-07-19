import { useCancelEvent, useDeleteEvent, usePublishEvent } from "@/hooks/useEvent"
import { EventResponse } from "@/types/response/EventResponse"
import { Globe, Pencil, Trash2, XCircle } from "lucide-react"

export default function EventRowActions({event, onEdit}: {event: EventResponse, onEdit: (event: EventResponse) => void}) {
    const { mutate: publishEvent, isPending: isPublishing } = usePublishEvent()
    const { mutate: cancelEvent, isPending: isCancelling } = useCancelEvent()
    const { mutate: deleteEvent, isPending: isDeleting } = useDeleteEvent()

    const handlePublish = () => publishEvent(event.id)

    const handleCancel = () => {
        if (confirm(`Batalkan event "${event.nama}"?`)) {
            cancelEvent(event.id)
        }
    }

    const handleDelete = () => {
        if (confirm(`Hapus event "${event.nama}"? Tindakan ini tidak bisa diurungkan.`)) {
            deleteEvent(event.id)
        }
    }

    return (
        <div className="flex items-center gap-1.5">
            {/* Edit — hanya DRAFT */}
            {event.status === 'DRAFT' && (
                <button
                    onClick={() => onEdit(event)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors"
                    title="Edit"
                >
                    <Pencil size={14} />
                </button>
            )}

            {/* Publish — hanya DRAFT */}
            {event.status === 'DRAFT' && (
                <button
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className="p-1.5 rounded-lg text-amber-400 hover:text-amber-300 hover:bg-amber-400/10 transition-colors disabled:opacity-50"
                    title="Publikasikan"
                >
                    <Globe size={14} />
                </button>
            )}

            {/* Cancel — DRAFT atau PUBLISHED */}
            {(event.status === 'DRAFT' || event.status === 'PUBLISHED') && (
                <button
                    onClick={handleCancel}
                    disabled={isCancelling}
                    className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                    title="Batalkan"
                >
                    <XCircle size={14} />
                </button>
            )}

            {/* Delete — hanya DRAFT */}
            {event.status === 'DRAFT' && (
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                    title="Hapus"
                >
                    <Trash2 size={14} />
                </button>
            )}
        </div>
    )
}