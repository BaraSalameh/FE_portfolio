import { clearAuthCookies } from '@/lib/api/cookies';
import { NextResponse } from 'next/server';

export async function POST() {
    return clearAuthCookies(new NextResponse(null, { status: 204 }));
}
