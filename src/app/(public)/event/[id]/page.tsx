import { Metadata } from 'next';
import { cookies } from 'next/headers';
import EventDetailClient from './eventDetailClient'
interface Props {
    params: Promise<{
        id: string;
    }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    if (!baseUrl) {
        return { title: 'Detail Event | Tiketin' }
    }

    const url = `${baseUrl}/events/${id}`
    const token = (await cookies()).get('token')?.value
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined

    try {
        const res = await fetch(url, { cache: 'no-store', headers })
        if (!res.ok) {
            console.error('metadata fetch failed', res.status, res.statusText, url, { token: Boolean(token) })
            return { title: 'Detail Event | Tiketin' }
        }

        const json = await res.json()
        const event = json?.data

        if (!event) {
            console.error('metadata event is null', { url, json })
            return { title: 'Detail Event | Tiketin' }
        }

        return {
            title: `${event.nama} | Tiketin`,
            description: event.deskripsi?.slice(0, 150),
            openGraph: {
                title: event.nama,
                description: event.deskripsi?.slice(0, 150),
                type: 'website',
            },
        }
    } catch (error) {
        console.error('generateMetadata error', error)
        return {
            title: 'Detail Event | Tiketin',
        }
    }
}

export default function EventDetailPage() {
    return <EventDetailClient />
}