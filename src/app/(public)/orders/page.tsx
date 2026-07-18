import { Metadata } from 'next'
import OrdersClient from './ordersClient'

export const metadata: Metadata = {
    title: 'Order Saya | Tiketin',
    description: 'Daftar order tiket event kamu di Tiketin',
}

export default function OrdersPage() {
    return <OrdersClient />
}