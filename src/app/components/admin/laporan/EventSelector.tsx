import { EventResponse } from "@/types/response/EventResponse"
import { ChevronDown } from "lucide-react"

export default function EventSelector({events, selectedId, onSelect,}: {events: EventResponse[], selectedId: string, onSelect: (id: string) => void}) {
    const published = events.filter((e) => e.status === 'PUBLISHED')

    return (
        <div className="relative">
            <select
                value={selectedId}
                onChange={(e) => onSelect(e.target.value)}
                className="w-full appearance-none px-4 py-3 bg-slate-900 border border-slate-700/60 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/50 transition-colors cursor-pointer pr-10 [scheme:dark]"
            >
                <option value="">-- Pilih Event --</option>
                {published.map((event) => (
                    <option key={event.id} value={event.id}>
                        {event.nama}
                    </option>
                ))}
            </select>
            <ChevronDown
                size={15}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            />
        </div>
    )
}
