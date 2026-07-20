'use client'

import { useState } from 'react'
import { X, Trash2, Plus } from 'lucide-react'
import { TiketKategoriResponse } from '@/types/response/TiketKategoriResponse'
import { CreateTiketKategoriRequest } from '@/types/request/CreateTiketKategoriRequest'
import { useGetAllTiketKategori, useCreateTiketKategori, useUpdateTiketKategori, useDeleteTiketKategori } from '@/hooks/useTiketKategori'
import { formatHarga } from '@/utils/formatHarga'
import { TiketKategoriModalProps } from '@/types/TiketKategoriModalProps'

const EMPTY_FORM: CreateTiketKategoriRequest = {
    nama: '',
    harga: 0,
    kuota: 0,
}

export default function TiketKategoriModal({ eventId, onClose }: TiketKategoriModalProps) {
    const [form, setForm] = useState<CreateTiketKategoriRequest>(EMPTY_FORM)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [showForm, setShowForm] = useState(false)

    const { data: tiketKategori = [], isLoading } = useGetAllTiketKategori(eventId)
    const { mutate: createTiket, isPending: isCreating } = useCreateTiketKategori()
    const { mutate: updateTiket, isPending: isUpdating } = useUpdateTiketKategori()
    const { mutate: deleteTiket, isPending: isDeleting } = useDeleteTiketKategori()

    const isPending = isCreating || isUpdating || isDeleting

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        const fieldValue = name === 'harga' || name === 'kuota' 
            ? parseInt(value) || 0 
            : value
        setForm((prev) => ({ ...prev, [name]: fieldValue }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (editingId) {
            updateTiket(
                { id: editingId, data: form },
                { 
                    onSuccess: () => {
                        setForm(EMPTY_FORM)
                        setEditingId(null)
                        setShowForm(false)
                    }
                }
            )
        } else {
            createTiket(
                { eventId, data: form },
                {
                    onSuccess: () => {
                        setForm(EMPTY_FORM)
                        setShowForm(false)
                    }
                }
            )
        }
    }

    const handleEdit = (item: TiketKategoriResponse) => {
        setForm({
            nama: item.nama,
            harga: item.harga,
            kuota: item.kuota,
        })
        setEditingId(item.id)
        setShowForm(true)
    }

    const handleDelete = (id: string, nama: string) => {
        if (confirm(`Hapus kategori tiket "${nama}"?`)) {
            deleteTiket(id)
        }
    }

    const handleCancel = () => {
        setForm(EMPTY_FORM)
        setEditingId(null)
        setShowForm(false)
    }

    const inputClass =
        'w-full px-3 py-2.5 bg-slate-800 border border-slate-700/60 rounded-lg text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/40 focus:border-yellow-400/50 transition-colors'

    const labelClass = 'block text-xs font-medium text-slate-400 mb-1.5'

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 shrink-0">
                    <h2 className="text-base font-semibold text-slate-100">Kelola Kategori Tiket</h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                    {/* Form */}
                    {showForm && (
                        <form onSubmit={handleSubmit} className="space-y-3 bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                            <h3 className="text-sm font-medium text-slate-200">
                                {editingId ? 'Edit Kategori Tiket' : 'Tambah Kategori Tiket'}
                            </h3>

                            <div>
                                <label className={labelClass}>Nama Kategori</label>
                                <input
                                    type="text"
                                    name="nama"
                                    value={form.nama}
                                    onChange={handleChange}
                                    placeholder="Contoh: VIP, Regular"
                                    className={inputClass}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className={labelClass}>Harga</label>
                                    <input
                                        type="number"
                                        name="harga"
                                        value={form.harga}
                                        onChange={handleChange}
                                        placeholder="0"
                                        className={inputClass}
                                        min="0"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Kuota</label>
                                    <input
                                        type="number"
                                        name="kuota"
                                        value={form.kuota}
                                        onChange={handleChange}
                                        placeholder="0"
                                        className={inputClass}
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="flex-1 px-4 py-2.5 bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-slate-100 text-sm font-medium rounded-lg transition-colors"
                                >
                                    {isPending ? 'Menyimpan...' : 'Simpan'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-100 text-sm font-medium rounded-lg transition-colors"
                                >
                                    Batal
                                </button>
                            </div>
                        </form>
                    )}

                    {/* List Tiket Kategori */}
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8 text-slate-400">
                            Loading...
                        </div>
                    ) : tiketKategori.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                            <p className="text-sm">Belum ada kategori tiket</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {tiketKategori.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg hover:border-slate-600/50 transition-colors"
                                >
                                    <div className="flex-1">
                                        <h4 className="text-sm font-medium text-slate-100">{item.nama}</h4>
                                        <p className="text-xs text-slate-400 mt-1">
                                            {formatHarga(item.harga)} • Kuota: {item.kuota} • Terjual: {item.terjual}
                                        </p>
                                    </div>
                                    <div className="flex gap-1.5 shrink-0 ml-3">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="p-1.5 rounded-lg text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 transition-colors disabled:opacity-50"
                                            disabled={isPending}
                                            title="Edit"
                                        >
                                            <span className="text-xs">Edit</span>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id, item.nama)}
                                            className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                                            disabled={isPending}
                                            title="Hapus"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {!showForm && (
                    <div className="border-t border-slate-800 px-5 py-3 flex gap-2 shrink-0">
                        <button
                            onClick={() => {
                                setForm(EMPTY_FORM)
                                setShowForm(true)
                            }}
                            className="flex items-center justify-center gap-2 flex-1 px-4 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-slate-100 text-sm font-medium rounded-lg transition-colors"
                        >
                            <Plus size={16} />
                            Tambah Kategori
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
