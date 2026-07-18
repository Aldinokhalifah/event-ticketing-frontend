export default function OrderCardSkeleton() {
    return (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 animate-pulse space-y-4">
            <div className="flex justify-between">
                <div className="flex gap-3">
                    <div className="w-9 h-9 bg-slate-800 rounded-xl" />
                    <div className="space-y-1.5">
                        <div className="w-24 h-3 bg-slate-800 rounded" />
                        <div className="w-32 h-3 bg-slate-800 rounded" />
                    </div>
                </div>
                <div className="w-20 h-6 bg-slate-800 rounded-full" />
            </div>
            <div className="w-32 h-7 bg-slate-800 rounded-lg" />
        </div>
    )
}