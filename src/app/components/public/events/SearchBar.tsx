// components/SearchBar.tsx
'use client'

import { Search, X } from 'lucide-react'
import { SearchBarProps } from '@/types/SearchBarProps'

export default function SearchBar({value, onChange, placeholder = 'Cari event, lokasi...',}: SearchBarProps) {
    return (
        <div className="relative group">
            {/* Border gradient efek */}
            <div className="absolute -inset-px rounded-2xl bg-linear-to-r from-amber-400/40 via-amber-400/10 to-amber-400/40 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />

            <div className="relative flex items-center bg-slate-900 border border-slate-700/60 rounded-2xl overflow-hidden transition-colors duration-200 group-focus-within:border-amber-400/50">
                {/* Icon search */}
                <div className="pl-5 pr-3 flex items-center shrink-0">
                    <Search size={18} className="text-slate-500 group-focus-within:text-amber-400 transition-colors duration-200" />
                </div>

                {/* Input */}
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="flex-1 py-4 pr-4 bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
                />

                {/* Clear button — muncul kalau ada value */}
                {value && (
                    <button
                        onClick={() => onChange('')}
                        className="pr-4 pl-2 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                        aria-label="Hapus pencarian"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>
        </div>
    )
}