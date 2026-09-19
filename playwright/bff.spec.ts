import { expect, test } from '@playwright/test';

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
    expect(authCookies).toHaveLength(3);
    expect(authCookies).toEqual(expect.arrayContaining([
        expect.stringMatching(/^AccessToken=.*; Path=\/(?:;|$)/i),
        expect.stringMatching(/^RefreshToken=.*; Path=\/(?:;|$)/i),
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
        expect.stringMatching(/^AccessToken=new-access; Path=\/(?:;|$)/i),
        expect.stringMatching(/^RefreshToken=new-refresh; Path=\/(?:;|$)/i),
        expect.stringMatching(/^RefreshToken=; Path=\/api\/Account;/i),
    ]));
});

test('rejects API request bodies larger than portfolio-api accepts', async ({ request }) => {
    const response = await request.post('/api/Account/Login', {
        data: 'x'.repeat(6_291_457),
    });

    expect(response.status()).toBe(413);
});
