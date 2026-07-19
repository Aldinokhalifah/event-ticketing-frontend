export default function StatCard({label, value, icon: Icon, accent = false,}: {label: string, value: string, icon: React.ElementType, accent?: boolean}) {
    return (
        <div className={`rounded-2xl border p-5 space-y-3 ${
            accent
                ? 'bg-amber-400/5 border-amber-400/20'
                : 'bg-slate-900/60 border-slate-700/60'
        }`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                accent
                    ? 'bg-amber-400/10 border border-amber-400/20'
                    : 'bg-slate-800 border border-slate-700'
            }`}>
                <Icon size={16} className={accent ? 'text-amber-400' : 'text-slate-400'} />
            </div>
            <div>
                <p className="text-xs text-slate-500 mb-1">{label}</p>
                <p className={`text-xl font-bold tracking-tight ${
                    accent ? 'text-amber-400' : 'text-white'
                }`}>
                    {value}
                </p>
            </div>
        </div>
    )
}