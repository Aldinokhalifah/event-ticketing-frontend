import type { Metadata } from 'next';

interface Props {
    params: {
        id: string;
    };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        const base = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '')
        if (!base) {
            return { title: 'Detail Event | Tiketin' }
        }

        const res = await fetch(`${base}/events/${params.id}`, { cache: 'no-store' })
        if (!res.ok) return { title: 'Detail Event | Tiketin' }

        const json = await res.json()
        const event = json?.data
        if (!event) return { title: 'Detail Event | Tiketin' }

        return {
            title: `${event.nama} | Tiketin`,
            description: event.deskripsi?.slice(0, 150),
            openGraph: {
                title: event.nama,
                description: event.deskripsi?.slice(0, 150),
                type: 'website',
            },
        }
    } catch {
        return {
            title: 'Detail Event | Tiketin',
        }
    }
}