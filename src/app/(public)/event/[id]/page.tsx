import EventDetailClient from './eventDetailClient'
import { generateMetadata as getMetadata } from '@/utils/generateMetadata'

interface Props {
    params: { id: string }
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Props) {
    return await getMetadata({ params })
}

export default function EventDetailPage() {
    return <EventDetailClient />
}