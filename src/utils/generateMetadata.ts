import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    // fetch data event untuk dapat nama
    const event = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${params.id}`)
        .then(res => res.json())

    return {
        title: `${event.data.nama} | Tiketin`,
        description: event.data.deskripsi,
    }
}