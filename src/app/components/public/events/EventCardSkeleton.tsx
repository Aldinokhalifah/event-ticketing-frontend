interface EventCardSkeletonProps {
    featured?: boolean
}

export default function EventCardSkeleton({ featured = false }: EventCardSkeletonProps) {
    return (
        <div
            className={`rounded-2xl bg-slate-800/60 animate-pulse border border-slate-700/30 ${
                featured ? 'min-h-80' : 'min-h-40'
            }`}
        >
            <div className="p-4 h-full flex flex-col justify-between">
                {/* Badge skeleton */}
                <div className="w-20 h-5 bg-slate-700 rounded-full" />

                <div className="space-y-2">
                    {/* Title skeleton */}
                    <div className={`bg-slate-700 rounded-lg ${featured ? 'h-7 w-3/4' : 'h-4 w-4/5'}`} />
                    {featured && <div className="bg-slate-700 rounded-lg h-7 w-1/2" />}

                    {/* Meta skeleton */}
                    <div className="space-y-1.5 mt-2">
                        <div className="bg-slate-700/70 rounded h-3 w-2/3" />
                        <div className="bg-slate-700/70 rounded h-3 w-1/2" />
                    </div>

                    {/* CTA skeleton */}
                    {featured && (
                        <div className="bg-slate-700 rounded-xl h-9 w-28 mt-3" />
                    )}
                </div>
            </div>
        </div>
    )
}