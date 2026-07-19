import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    // Baca JWT token dari httpOnly cookie — tidak bisa diakses browser langsung
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
        return NextResponse.json(
            { error: 'Unauthorized — silakan login terlebih dahulu' },
            { status: 401 }
        )
    }

    const body = await request.json()

    const response = await fetch(
        `${process.env.MCP_CLIENT_URL ?? 'http://localhost:8001'}/chat`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // inject token dari cookie ke request MCP client
            body: JSON.stringify({ ...body, token }),
        }
    )

    if (!response.ok) {
        return NextResponse.json(
            { error: 'AI Agent tidak tersedia' },
            { status: response.status }
        )
    }

    const data = await response.json()
    return NextResponse.json(data)
}