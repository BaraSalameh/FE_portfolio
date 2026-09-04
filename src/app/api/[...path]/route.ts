import { getApiBaseUrl } from '@/lib/api/config';
import { normalizeAuthCookiePath } from '@/lib/api/cookies';
import { NextRequest } from 'next/server';

const MAX_BODY_BYTES = 1_048_576;
const REQUEST_HEADERS = [
    'accept',
    'accept-language',
    'content-type',
    'cookie',
    'user-agent',
    'x-correlation-id',
    'x-retry',
] as const;
const RESPONSE_HEADERS = [
    'cache-control',
    'content-disposition',
    'content-language',
    'content-type',
    'etag',
    'last-modified',
    'retry-after',
    'vary',
    'www-authenticate',
    'x-correlation-id',
] as const;

async function relay(
    request: NextRequest,
    context: RouteContext<'/api/[...path]'>,
) {
    const { path } = await context.params;
    const target = new URL(`${getApiBaseUrl()}/${path.map(encodeURIComponent).join('/')}`);
    target.search = request.nextUrl.search;

    const requestHeaders = new Headers();
    for (const name of REQUEST_HEADERS) {
        const value = request.headers.get(name);
        if (value) requestHeaders.set(name, value);
    }
    requestHeaders.set('origin', request.nextUrl.origin);

    let body: ArrayBuffer | undefined;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
        const declaredLength = Number(request.headers.get('content-length') ?? 0);
        if (declaredLength > MAX_BODY_BYTES) {
            return Response.json(
                { title: 'Request body is too large.', status: 413 },
                { status: 413 },
            );
        }
        body = await request.arrayBuffer();
        if (body.byteLength > MAX_BODY_BYTES) {
            return Response.json(
                { title: 'Request body is too large.', status: 413 },
                { status: 413 },
            );
        }
    }

    try {
        const upstream = await fetch(target, {
            method: request.method,
            headers: requestHeaders,
            body,
            cache: 'no-store',
            redirect: 'manual',
            signal: AbortSignal.timeout(30_000),
        });

        const responseHeaders = new Headers();
        for (const name of RESPONSE_HEADERS) {
            const value = upstream.headers.get(name);
            if (value) responseHeaders.set(name, value);
        }
        for (const cookie of upstream.headers.getSetCookie()) {
            responseHeaders.append('set-cookie', normalizeAuthCookiePath(cookie));
        }

        return new Response(upstream.body, {
            status: upstream.status,
            statusText: upstream.statusText,
            headers: responseHeaders,
        });
    } catch {
        return Response.json(
            { title: 'portfolio-api is unavailable.', status: 502 },
            { status: 502 },
        );
    }
}

export const GET = relay;
export const POST = relay;
export const PUT = relay;
export const PATCH = relay;
export const DELETE = relay;
