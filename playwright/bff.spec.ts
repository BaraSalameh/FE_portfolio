import { expect, test } from '@playwright/test';

test('the API relay and logout reject cross-origin authenticated mutations', async ({ request }) => {
    for (const route of ['/api/Account/ValidateToken', '/auth/logout']) {
        const response = await request.post(route, {
            headers: { origin: 'https://untrusted.example', cookie: 'RefreshToken=old-refresh' },
            data: {},
        });
        expect(response.status()).toBe(403);
        expect(response.headers()['set-cookie']).toBeUndefined();
    }
});

test('terminal logout clears current and legacy refresh cookie paths', async ({ context }) => {
    await context.addCookies(['/', '/api', '/api/Account'].map(path => ({
        name: 'RefreshToken', value: 'stale', domain: 'localhost', path,
    })));
    const response = await context.request.post('/auth/logout');
    expect(response.status()).toBe(204);
    const cookies = response.headersArray().filter(header => header.name.toLowerCase() === 'set-cookie').map(header => header.value);
    for (const path of ['/', '/api', '/api/Account']) {
        expect(cookies.some(cookie => cookie.startsWith(`RefreshToken=; Path=${path};`))).toBe(true);
    }
    expect((await context.cookies()).filter(cookie => cookie.name === 'RefreshToken')).toHaveLength(0);
});

test('forwards API query parameters and correlation headers', async ({ request }) => {
    const response = await request.get('/api/Client/UserList?PageNumber=2&PageSize=5', {
        headers: { 'x-correlation-id': 'bff-contract-query' },
    });

    expect(response.status()).toBe(200);
    expect(response.headers()['x-correlation-id']).toBe('bff-contract-query');
    await expect(response.json()).resolves.toMatchObject({
        query: '?PageNumber=2&PageSize=5',
    });
});

test('forwards trusted origin, body, cookies, and all auth cookies', async ({ request, baseURL }) => {
    const response = await request.post('/api/Account/ValidateToken', {
        data: { probe: true },
        headers: {
            cookie: 'AccessToken=old-access; RefreshToken=old-refresh',
        },
    });

    expect(response.status()).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
        body: JSON.stringify({ probe: true }),
        cookie: 'AccessToken=old-access; RefreshToken=old-refresh',
        origin: baseURL,
    });
    const authCookies = response.headersArray()
        .filter(header => header.name.toLowerCase() === 'set-cookie')
        .map(header => header.value);
    expect(authCookies).toHaveLength(4);
    expect(authCookies).toEqual(expect.arrayContaining([
        expect.stringMatching(/^AccessToken=.*; Path=\/(?:;|$)/i),
        expect.stringMatching(/^RefreshToken=.*; Path=\/(?:;|$)/i),
        expect.stringMatching(/^RefreshToken=; Path=\/api;/i),
        expect.stringMatching(/^RefreshToken=; Path=\/api\/Account;/i),
    ]));
});

test('refreshes an expired server-rendered session and returns to the requested page', async ({ request }) => {
    const response = await request.get('/api/Account/RefreshSession?returnTo=%2Fowner%2Fdemo%2Fdashboard', {
        headers: { cookie: 'RefreshToken=old-refresh' },
        maxRedirects: 0,
    });

    expect(response.status()).toBe(307);
    expect(response.headers().location).toMatch(/\/owner\/demo\/dashboard$/);
    const authCookies = response.headersArray()
        .filter(header => header.name.toLowerCase() === 'set-cookie')
        .map(header => header.value);
    expect(authCookies).toEqual(expect.arrayContaining([
        expect.stringMatching(/^AccessToken=.*; Path=\/(?:;|$)/i),
        expect.stringMatching(/^RefreshToken=new-refresh; Path=\/(?:;|$)/i),
        expect.stringMatching(/^RefreshToken=; Path=\/api;/i),
    ]));
});

test('RSC requests cannot rotate tokens before the document navigation', async ({ request }) => {
    const response = await request.get('/api/Account/RefreshSession?returnTo=%2Fowner%2Fdemo%2Fsettings', {
        headers: { cookie: 'RefreshToken=old-refresh', rsc: '1' },
    });

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toBe('text/html');
    expect(response.headers()['set-cookie']).toBeUndefined();
});

test('failed refresh preserves the protected destination and clears stale auth cookies', async ({ request }) => {
    const response = await request.get('/api/Account/RefreshSession?returnTo=%2Fowner%2Fdemo%2Fsettings%3Fsection%3Dprofile', {
        headers: { cookie: 'RefreshToken=invalid-refresh' },
        maxRedirects: 0,
    });

    expect(response.status()).toBe(307);
    expect(response.headers().location).toMatch(/\/auth\/login\?returnTo=%2Fowner%2Fdemo%2Fsettings%3Fsection%3Dprofile&refreshFailed=1$/);
    const authCookies = response.headersArray()
        .filter(header => header.name.toLowerCase() === 'set-cookie')
        .map(header => header.value);
    expect(authCookies).toEqual(expect.arrayContaining([
        expect.stringMatching(/^AccessToken=; Path=\/;/i),
        expect.stringMatching(/^RefreshToken=; Path=\/;/i),
    ]));
});

test('temporary refresh failures preserve the refresh token and avoid a login loop', async ({ request }) => {
    const response = await request.get('/api/Account/RefreshSession?returnTo=%2Fowner%2Fdemo%2Fsettings', {
        headers: { cookie: 'RefreshToken=temporary-error' },
        maxRedirects: 0,
    });

    expect(response.status()).toBe(307);
    expect(response.headers().location).toMatch(/\/auth\/login\?returnTo=%2Fowner%2Fdemo%2Fsettings&refreshFailed=1$/);
    const authCookies = response.headersArray()
        .filter(header => header.name.toLowerCase() === 'set-cookie')
        .map(header => header.value);
    expect(authCookies).toHaveLength(0);
});

test('rejects API request bodies larger than portfolio-api accepts', async ({ request }) => {
    const response = await request.post('/api/Account/Login', {
        data: 'x'.repeat(6_291_457),
    });

    expect(response.status()).toBe(413);
});
