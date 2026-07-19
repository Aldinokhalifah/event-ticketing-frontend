export default function TableSkeleton() {
    return (
        <div className="space-y-px">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4 bg-slate-900/40 animate-pulse">
                    <div className="flex-1 h-4 bg-slate-800 rounded" />
                    <div className="w-24 h-4 bg-slate-800 rounded" />
                    <div className="w-20 h-4 bg-slate-800 rounded" />
                    <div className="w-20 h-6 bg-slate-800 rounded-full" />
                    <div className="w-28 h-8 bg-slate-800 rounded-xl" />
                </div>
            ))}
        </div>
    )
}