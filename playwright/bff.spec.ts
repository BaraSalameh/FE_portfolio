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
    expect(authCookies).toHaveLength(2);
    expect(authCookies).toEqual(expect.arrayContaining([
        expect.stringMatching(/^AccessToken=.*; Path=\/(?:;|$)/i),
        expect.stringMatching(/^RefreshToken=.*; Path=\/api\/Account(?:;|$)/i),
    ]));
});

test('rejects API request bodies larger than portfolio-api accepts', async ({ request }) => {
    const response = await request.post('/api/Account/Login', {
        data: 'x'.repeat(1_048_577),
    });

    expect(response.status()).toBe(413);
});
