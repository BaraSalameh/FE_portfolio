import { expect, test } from '@playwright/test';
import { browserApiResponse } from '../src/lib/api/browser-client';
import { refreshTokenClient } from '../src/lib/api/refresh';

const originalFetch = globalThis.fetch;
const unauthorized = () => Response.json({ title: 'Unauthorized' }, { status: 401 });

test.afterEach(() => {
    globalThis.fetch = originalFetch;
});

test('concurrent browser mutations share refresh and replay their methods, bodies and headers', async () => {
    const calls: { url: string; init?: RequestInit }[] = [];
    const attempts = new Map<string, number>();
    globalThis.fetch = async (input, init) => {
        const url = String(input);
        calls.push({ url, init });
        if (url.endsWith('/ValidateToken')) {
            await new Promise(resolve => setTimeout(resolve, 20));
            return Response.json({});
        }
        const attempt = (attempts.get(url) ?? 0) + 1;
        attempts.set(url, attempt);
        return attempt === 1 ? unauthorized() : Response.json({ saved: true });
    };
    const results = await Promise.all([
        browserApiResponse({ method: 'PATCH', url: '/Owner/EditProfile', data: { name: 'Demo' }, headers: new Headers({ 'x-correlation-id': 'profile' }) }, refreshTokenClient),
        browserApiResponse({ method: 'DELETE', url: '/Owner/DeleteMessage', data: { id: '123' }, headers: [['x-correlation-id', 'message']] }, refreshTokenClient),
    ]);
    expect(results.map(response => response.status)).toEqual([200, 200]);
    expect(calls.filter(call => call.url.endsWith('/ValidateToken'))).toHaveLength(1);
    for (const endpoint of ['/api/Owner/EditProfile', '/api/Owner/DeleteMessage']) {
        const requests = calls.filter(call => call.url === endpoint);
        expect(requests).toHaveLength(2);
        expect(requests[1].init).toEqual(requests[0].init);
        expect(requests[0].init?.credentials).toBe('include');
    }
    expect(calls[0].init?.headers).toMatchObject({ 'x-correlation-id': 'profile' });
    expect(calls[0].init?.body).toBe('{"name":"Demo"}');
});

test('multipart browser mutations replay the original FormData without adding a content type', async () => {
    const bodies: unknown[] = [];
    let refreshes = 0;
    globalThis.fetch = async (_input, init) => {
        bodies.push(init?.body);
        expect(new Headers(init?.headers).has('content-type')).toBe(false);
        return bodies.length === 1 ? unauthorized() : Response.json({});
    };
    const data = new FormData();
    data.append('file', new Blob(['attachment']), 'attachment.txt');
    await browserApiResponse({ method: 'POST', url: '/Owner/Upload', data }, async () => {
        refreshes++;
        return Response.json({});
    });
    expect(refreshes).toBe(1);
    expect(bodies).toEqual([data, data]);
});

test('explicit content types override the default regardless of header casing', async () => {
    const variants: HeadersInit[] = [
        new Headers({ 'Content-Type': 'application/problem+json' }),
        [['Content-Type', 'application/problem+json']],
        { 'CONTENT-TYPE': 'application/problem+json' },
    ];
    globalThis.fetch = async (_input, init) => {
        expect(new Headers(init?.headers).get('content-type')).toBe('application/problem+json');
        return Response.json({});
    };
    for (const headers of variants) {
        await browserApiResponse({ method: 'POST', url: '/Owner/EditProfile', data: {}, headers });
    }
});

test('public unauthorized calls do not refresh or log out', async () => {
    const urls: string[] = [];
    globalThis.fetch = async (input, init) => {
        urls.push(String(input));
        expect(init?.credentials).toBe('omit');
        return unauthorized();
    };
    await expect(browserApiResponse({ method: 'POST', url: '/Account/Login', sendCredentials: false }))
        .rejects.toMatchObject({ status: 401 });
    expect(urls).toEqual(['/api/Account/Login']);
});

test('a temporary refresh failure preserves the session and its original status', async () => {
    const urls: string[] = [];
    globalThis.fetch = async input => {
        const url = String(input);
        urls.push(url);
        return url.endsWith('/ValidateToken')
            ? Response.json({ title: 'Unavailable' }, { status: 503 }) : unauthorized();
    };
    await expect(browserApiResponse({ method: 'POST', url: '/Owner/EditProfile', data: {} }, refreshTokenClient))
        .rejects.toMatchObject({ status: 503 });
    expect(urls).toEqual(['/api/Owner/EditProfile', '/api/Account/ValidateToken']);
});

test('a forbidden retry is not reclassified as an invalid session', async () => {
    let calls = 0;
    globalThis.fetch = async () => ++calls === 1 ? unauthorized()
        : Response.json({ title: 'Forbidden' }, { status: 403 });
    await expect(browserApiResponse({ method: 'POST', url: '/Owner/EditProfile' }, async () => Response.json({})))
        .rejects.toMatchObject({ status: 403 });
    expect(calls).toBe(2);
});
