const GRADIENTS = [
    { from: '#7c3aed', to: '#4f46e5' },   // violet → indigo
    { from: '#d97706', to: '#ea580c' },   // amber → orange
    { from: '#059669', to: '#0d9488' },   // emerald → teal
    { from: '#e11d48', to: '#db2777' },   // rose → pink
    { from: '#2563eb', to: '#0891b2' },   // blue → cyan
    { from: '#7c3aed', to: '#db2777' },   // violet → pink
    { from: '#ca8a04', to: '#16a34a' },   // yellow → green
    { from: '#dc2626', to: '#7c3aed' },   // red → violet
]

export function getEventGradient(id: string): { from: string; to: string } {
    // Pakai beberapa karakter id supaya distribusi lebih merata
    const seed = id
        .split('')
        .reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return GRADIENTS[seed % GRADIENTS.length]
}

export function getEventGradientStyle(id: string): React.CSSProperties {
    const { from, to } = getEventGradient(id)
    return {
        background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
    }
}