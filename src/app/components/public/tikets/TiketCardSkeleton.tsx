export default function TiketCardSkeleton() {
    return (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 animate-pulse">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-800 rounded-xl" />
                    <div className="space-y-1.5">
                        <div className="w-36 h-4 bg-slate-800 rounded" />
                        <div className="w-24 h-3 bg-slate-800 rounded" />
                    </div>
                </div>
                <div className="w-20 h-6 bg-slate-800 rounded-full" />
            </div>
        </div>
    )
}
