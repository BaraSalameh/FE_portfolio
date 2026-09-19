import { clearAuthCookies } from '@/lib/api/cookies';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const origin = request.headers.get('origin');
    if ((origin && origin !== request.nextUrl.origin) || request.headers.get('sec-fetch-site') === 'cross-site') {
        return NextResponse.json({ title: 'Cross-site request rejected.', status: 403 }, { status: 403 });
    }
    return clearAuthCookies(new NextResponse(null, { status: 204 }));
}
