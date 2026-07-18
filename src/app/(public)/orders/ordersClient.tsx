'use client'

import { useMemo, useState } from 'react'
import { useGetAllOrder } from '@/hooks/useOrder'
import OrderCard from '@/app/components/public/orders/OrderCard'
import { OrderStatus } from '@/types/enum/OrderStatus'
import { Receipt } from 'lucide-react'
import { STATUS_FILTERS } from '@/utils/orderStatusFilter'
import OrderCardSkeleton from '@/app/components/public/orders/OrderCardSkeleton'

export default function OrdersClient() {
    const { data: orders, isPending, isError } = useGetAllOrder()
    const [activeFilter, setActiveFilter] = useState<OrderStatus | 'ALL'>('ALL')

    const filtered = useMemo(() => {
        return orders?.filter((order) =>
            activeFilter === 'ALL' ? true : order.status === activeFilter
    ) ?? []
    }, [activeFilter, orders])

    return (
        <div className="min-h-screen bg-slate-950">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-16">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                            <Receipt size={16} className="text-amber-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">
                            Order Saya
                        </h1>
                    </div>
                    {!isPending && (
                        <p className="text-slate-500 text-sm ml-12">
                            {orders?.length ?? 0} order ditemukan
                        </p>
                    )}
                </div>

                {/* Filter tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none">
                    {STATUS_FILTERS.map((filter) => {
                        const count = filter.value === 'ALL'
                            ? orders?.length ?? 0
                            : orders?.filter((o) => o.status === filter.value).length ?? 0

                        return (
                            <button
                                key={filter.value}
                                onClick={() => setActiveFilter(filter.value)}
                                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors duration-200 shrink-0 ${
                                    activeFilter === filter.value
                                        ? 'bg-amber-400 text-slate-950'
                                        : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-slate-700/60'
                                }`}
                            >
                                {filter.label}
                                {!isPending && (
                                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                                        activeFilter === filter.value
                                            ? 'bg-slate-950/20 text-slate-900'
                                            : 'bg-slate-700 text-slate-400'
                                    }`}>
                                        {count}
                                    </span>
                                )}
                            </button>
                        )
                    })}
                </div>

                {/* Error */}
                {isError && (
                    <div className="text-center py-16 text-slate-400 text-sm">
                        Gagal memuat order. Coba refresh halaman.
                    </div>
                )}

                {/* Loading */}
                {isPending && (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => <OrderCardSkeleton key={i} />)}
                    </div>
                )}

                {/* Empty */}
                {!isPending && filtered.length === 0 && (
                    <div className="text-center py-24 space-y-3">
                        <div className="text-4xl">🧾</div>
                        <p className="text-slate-300 font-medium">
                            {activeFilter === 'ALL'
                                ? 'Belum ada order'
                                : `Tidak ada order dengan status "${STATUS_FILTERS.find(f => f.value === activeFilter)?.label}"`}
                        </p>
                        <p className="text-slate-500 text-sm">
                            {activeFilter === 'ALL'
                                ? 'Cari event menarik dan beli tiket pertamamu'
                                : ''}
                        </p>
                    </div>
                )}

                {/* Order list */}
                {!isPending && filtered.length > 0 && (
                    <div className="space-y-4">
                        {filtered.map((order) => (
                            <OrderCard key={order.id} order={order} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}