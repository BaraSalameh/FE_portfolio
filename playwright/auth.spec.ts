import { expect, test } from '@playwright/test';
import { safeAppPath } from '../src/lib/api/auth-navigation';

test('return paths reject external URLs and authentication loops', () => {
    for (const value of [
        'https://evil.example/path', '//evil.example/path', '/\\evil.example/path',
        '/%2f%2fevil.example/path', '/auth/login?returnTo=/auth/login',
        '/api/Account/RefreshSession', '/API/Account/RefreshSession/', '/auth/logout',
        '/%61pi/Account/RefreshSession', '/auth/%6cogin', '/bad%escape',
    ]) expect(safeAppPath(value), value).toBeNull();
    expect(safeAppPath('/owner/demo/settings?section=profile&filter=a%26b#contact'))
        .toBe('/owner/demo/settings?section=profile&filter=a%26b#contact');
    expect(safeAppPath('/auth/login?returnTo=%2Fowner%2Fdemo%2Fsettings', { allowLogin: true }))
        .toBe('/auth/login?returnTo=%2Fowner%2Fdemo%2Fsettings');
    expect(safeAppPath('/api/Account/RefreshSession', { allowLogin: true })).toBeNull();
});

for (const state of ['expired', 'malformed', 'missing claims'] as const) {
    test(`login recovers a ${state} access token using the refresh token`, async ({ page, context }) => {
        const payload = Buffer.from(JSON.stringify({
            exp: Math.floor(Date.now() / 1000) + (state === 'expired' ? -60 : 3600),
            IsConfirmed: 'True',
            ...(state === 'missing claims' ? {} : { role: 'Owner', unique_name: 'demo' }),
        })).toString('base64url');
        await context.addCookies([
            { name: 'AccessToken', value: state === 'malformed' ? 'not-a-jwt' : `eyJhbGciOiJub25lIn0.${payload}.`, domain: 'localhost', path: '/' },
            { name: 'RefreshToken', value: 'old-refresh', domain: 'localhost', path: '/' },
        ]);
        await page.goto('/auth/login');
        await expect(page.getByRole('heading', { name: 'Demo Portfolio' })).toBeVisible();
        await expect(page).toHaveURL(/\/owner\/demo\/dashboard$/);
    });
}

test('a missing session goes to login without looping and keeps the requested destination', async ({ page, context }) => {
    await page.goto('/owner/demo/messages?filter=unread');
    await expect(page.getByRole('heading', { name: 'Sign in to your portfolio' })).toBeVisible();
    await expect(page).toHaveURL(/\/auth\/login\?returnTo=%2Fowner%2Fdemo%2Fmessages%3Ffilter%3Dunread&refreshFailed=1$/);
    expect((await context.cookies()).filter(cookie => ['AccessToken', 'RefreshToken'].includes(cookie.name))).toHaveLength(0);
});

test('login completes, then Settings renews and retains the rotated session', async ({ page, context }) => {
    const requests: string[] = [];
    page.on('request', request => {
        if (request.url().includes('/api/Account/') && request.isNavigationRequest()) requests.push(`${request.method()} ${new URL(request.url()).pathname}`);
    });
    await page.goto('/auth/login');
    await page.getByLabel('Email').fill('success@example.com');
    await page.getByLabel('Password').fill('ValidPassword1!');
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    await expect(page).toHaveURL(/\/owner\/demo\/dashboard$/);
    await expect(page.getByRole('heading', { name: 'Demo Portfolio' })).toBeVisible();

    const originalRefresh = (await context.cookies()).find(cookie => cookie.name === 'RefreshToken')?.value;
    expect(originalRefresh).toBeTruthy();
    await context.clearCookies({ name: 'AccessToken' });
    await page.getByRole('button', { name: 'Open account menu' }).click();
    await page.getByRole('menuitem', { name: 'Settings', exact: true }).click();
    await expect(page).toHaveURL(/\/owner\/demo\/settings$/);
    await expect(page.getByRole('heading', { name: 'Settings', exact: true })).toBeVisible();
    const cookies = await context.cookies();
    expect(cookies.find(cookie => cookie.name === 'AccessToken')?.value).toBeTruthy();
    expect(cookies.find(cookie => cookie.name === 'RefreshToken')?.value).not.toBe(originalRefresh);
    expect(cookies.find(cookie => cookie.name === 'RefreshToken')?.value).toBeTruthy();
    expect(requests.filter(request => request.includes('RefreshSession'))).toHaveLength(1);

    await context.clearCookies({ name: 'AccessToken' });
    await page.goto('/owner/demo/profile?section=contact');
    await expect(page.getByLabel('Birth date')).toBeVisible();
    await expect(page).toHaveURL(/\/owner\/demo\/profile\?section=contact$/);
    expect((await context.cookies()).find(cookie => cookie.name === 'AccessToken')?.value).toBeTruthy();
});

test('a second unauthorized page result terminates recovery and manual login still works', async ({ page, context }) => {
    await context.addCookies([
        { name: 'RefreshToken', value: 'old-refresh', domain: 'localhost', path: '/' },
        { name: 'RejectAccess', value: 'true', domain: 'localhost', path: '/' },
    ]);
    await page.goto('/owner/demo/settings?section=profile');
    await expect(page).toHaveURL(/\/auth\/login\?returnTo=%2Fowner%2Fdemo%2Fsettings%3Fsection%3Dprofile&refreshFailed=1$/);
    expect((await context.cookies()).filter(cookie => ['AccessToken', 'RefreshToken'].includes(cookie.name))).toHaveLength(0);
    await context.clearCookies({ name: 'RejectAccess' });
    await page.getByLabel('Email').fill('success@example.com');
    await page.getByLabel('Password').fill('ValidPassword1!');
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    await expect(page).toHaveURL(/\/owner\/demo\/settings\?section=profile$/);
});

test('login submission is not redirected by cookies added after the form loaded', async ({ page, context }) => {
    await page.goto('/auth/login');
    await context.addCookies([{ name: 'RefreshToken', value: 'invalid-refresh', domain: 'localhost', path: '/' }]);
    await page.getByLabel('Email').fill('success@example.com');
    await page.getByLabel('Password').fill('ValidPassword1!');
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    await expect(page).toHaveURL(/\/owner\/demo\/dashboard$/);
});

test('a browser mutation refreshes once and completes the original settings change', async ({ page, context }) => {
    await page.goto('/auth/login?returnTo=%2Fowner%2Fdemo%2Fsettings');
    await page.getByLabel('Email').fill('success@example.com');
    await page.getByLabel('Password').fill('ValidPassword1!');
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    const toggle = page.getByRole('switch', { name: /(?:Hide|Show) gender/ });
    await expect(toggle).toBeEnabled();
    const initialChecked = await toggle.getAttribute('aria-checked');
    const initialRefresh = (await context.cookies()).find(cookie => cookie.name === 'RefreshToken')?.value;
    await context.clearCookies({ name: 'AccessToken' });
    await toggle.click();
    await expect(page.getByText('Preference saved.').first()).toBeVisible();
    await expect(toggle).not.toHaveAttribute('aria-checked', initialChecked!);
    await expect(page).toHaveURL(/\/owner\/demo\/settings$/);
    const cookies = await context.cookies();
    expect(cookies.find(cookie => cookie.name === 'AccessToken')?.value).toBeTruthy();
    expect(cookies.find(cookie => cookie.name === 'RefreshToken')?.value).toBeTruthy();
    expect(cookies.find(cookie => cookie.name === 'RefreshToken')?.value).not.toBe(initialRefresh);
});

test('a second unauthorized browser mutation clears the session and preserves its page', async ({ page, context }) => {
    await context.addCookies([
        { name: 'AccessToken', value: 'test-access', domain: 'localhost', path: '/' },
        { name: 'RefreshToken', value: 'old-refresh', domain: 'localhost', path: '/' },
        { name: 'RejectMutation', value: 'true', domain: 'localhost', path: '/' },
    ]);
    await page.goto('/owner/demo/settings?section=profile');
    const toggle = page.getByRole('switch', { name: /(?:Hide|Show) gender/ });
    await expect(toggle).toBeEnabled();
    await toggle.click();
    await expect(page).toHaveURL(/\/auth\/login\?returnTo=%2Fowner%2Fdemo%2Fsettings%3Fsection%3Dprofile&refreshFailed=1$/);
    expect((await context.cookies()).filter(cookie => ['AccessToken', 'RefreshToken'].includes(cookie.name))).toHaveLength(0);
});
