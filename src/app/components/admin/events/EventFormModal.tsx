// components/EventFormModal.tsx
'use client'

import { useState, useEffect } from 'react'
import { X, CalendarDays } from 'lucide-react'
import { EventResponse } from '@/types/response/EventResponse'
import { CreateEventRequest } from '@/types/request/CreateEventRequest'
import { useCreateEvent, useUpdateEvent } from '@/hooks/useEvent'

interface EventFormModalProps {
    event?: EventResponse       // kalau ada → mode edit, kalau tidak → mode create
    onClose: () => void
}

const EMPTY_FORM: CreateEventRequest = {
    nama: '',
    deskripsi: '',
    lokasi: '',
    tanggal: '',
    waktuMulai: '',
    waktuSelesai: '',
}

export default function EventFormModal({ event, onClose }: EventFormModalProps) {
    const isEdit = !!event
    const [form, setForm] = useState<CreateEventRequest>(EMPTY_FORM)

    const { mutate: createEvent, isPending: isCreating } = useCreateEvent()
    const { mutate: updateEvent, isPending: isUpdating } = useUpdateEvent()
    const isPending = isCreating || isUpdating

    // Isi form kalau mode edit
    useEffect(() => {
        if (event) {
            setForm({
                nama: event.nama,
                deskripsi: event.deskripsi,
                lokasi: event.lokasi,
                tanggal: event.tanggal,
                waktuMulai: event.waktuMulai.slice(0, 5),     // "HH:mm:ss" → "HH:mm"
                waktuSelesai: event.waktuSelesai.slice(0, 5),
            })
        }
    }, [event])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (isEdit && event) {
            updateEvent(
                { id: event.id, data: form },
                { onSuccess: onClose }
            )
        } else {
            createEvent(form, { onSuccess: onClose })
        }
    }

    // ── Input field helper ─────────────────────────────────────────────────

    const inputClass =
        'w-full px-3 py-2.5 bg-slate-800 border border-slate-700/60 rounded-xl text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/50 transition-colors'

    const labelClass = 'block text-xs font-medium text-slate-400 mb-1.5'

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="w-full max-w-lg bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                            <CalendarDays size={14} className="text-amber-400" />
                        </div>
                        <h3 className="text-sm font-semibold text-slate-100">
                            {isEdit ? 'Edit Event' : 'Buat Event Baru'}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Form — scrollable */}
                <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
                    <div className="p-5 space-y-4">
                        {/* Nama */}
                        <div>
                            <label className={labelClass}>
                                Nama Event <span className="text-red-400">*</span>
                            </label>
                            <input
                                name="nama"
                                value={form.nama}
                                onChange={handleChange}
                                placeholder="Contoh: Java Developer Conference 2026"
                                required
                                maxLength={256}
                                className={inputClass}
                            />
                        </div>

                        {/* Deskripsi */}
                        <div>
                            <label className={labelClass}>
                                Deskripsi <span className="text-red-400">*</span>
                            </label>
                            <textarea
                                name="deskripsi"
                                value={form.deskripsi}
                                onChange={handleChange}
                                placeholder="Ceritakan tentang event ini..."
                                required
                                rows={3}
                                className={`${inputClass} resize-none`}
                            />
                        </div>

                        {/* Lokasi */}
                        <div>
                            <label className={labelClass}>
                                Lokasi <span className="text-red-400">*</span>
                            </label>
                            <input
                                name="lokasi"
                                value={form.lokasi}
                                onChange={handleChange}
                                placeholder="Contoh: Jakarta Convention Center"
                                required
                                className={inputClass}
                            />
                        </div>

                        {/* Tanggal */}
                        <div>
                            <label className={labelClass}>
                                Tanggal <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="date"
                                name="tanggal"
                                value={form.tanggal}
                                onChange={handleChange}
                                required
                                className={`${inputClass} [scheme:dark]`}
                            />
                        </div>

                        {/* Waktu — 2 kolom */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className={labelClass}>
                                    Waktu Mulai <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="time"
                                    name="waktuMulai"
                                    value={form.waktuMulai}
                                    onChange={handleChange}
                                    required
                                    className={`${inputClass} [scheme:dark]`}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>
                                    Waktu Selesai <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="time"
                                    name="waktuSelesai"
                                    value={form.waktuSelesai}
                                    onChange={handleChange}
                                    required
                                    className={`${inputClass} [scheme:dark]`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-5 pb-5 flex gap-3 shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-800 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-sm font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isPending ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Buat Event'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}