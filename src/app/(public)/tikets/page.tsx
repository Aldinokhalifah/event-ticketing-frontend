import { Metadata } from 'next'
import TiketsClient from './tiketsClient'

export const metadata: Metadata = {
    title: 'Tiket Saya | Tiketin',
    description: 'Koleksi tiket event kamu di Tiketin',
}

export default function TiketsPage() {
    return <TiketsClient />
}