// Format waktu dari "HH:mm:ss" ke "HH:mm"
export function formatWaktu(waktu: string): string {
    return waktu.slice(0, 5)
}