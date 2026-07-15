export default function EventDetailSkeleton() {
    return (
        <div className="min-h-screen bg-slate-950 animate-pulse">
            {/* Hero skeleton */}
            <div className="h-56 sm:h-72 bg-slate-800" />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
                <div className="h-8 bg-slate-800 rounded-xl w-2/3" />
                <div className="space-y-2">
                    <div className="h-4 bg-slate-800 rounded w-1/3" />
                    <div className="h-4 bg-slate-800 rounded w-1/4" />
                </div>
                <div className="h-24 bg-slate-800 rounded-2xl" />
                <div className="space-y-3">
                    <div className="h-24 bg-slate-800 rounded-2xl" />
                    <div className="h-24 bg-slate-800 rounded-2xl" />
                </div>
            </div>
        </div>
    )
}