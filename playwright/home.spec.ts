import { test, expect, Page } from "@playwright/test";

const getHtml = (page: Page) => page.locator("html");

const isDarkTheme = async (page: Page) => {
    const html = getHtml(page);
    return await html.evaluate(el => el.classList.contains('dark'));
}

test("Page load", async ({ page }) => {
    const response = await page.goto('/', { waitUntil: 'networkidle'});
    expect(response?.ok()).toBe(true);
    await expect(page).toHaveTitle(/portfolio/i);
});

test("Theme toggle", async ({ page }) => {
    await page.goto("/");

    const themeToggleBtn = page.getByTestId('theme-toggle-button');
    await expect(themeToggleBtn).toBeVisible();

    const html = getHtml(page);
    const wasDark = await isDarkTheme(page);

    await themeToggleBtn.click();
    if (wasDark) {
        await expect(html).toHaveClass(/light/);
    } else {
        await expect(html).toHaveClass(/dark/);
    }

    const wasLight = !await isDarkTheme(page);
    await themeToggleBtn.click();

    if (wasLight) {
        await expect(html).toHaveClass(/dark/);
    } else {
        await expect(html).toHaveClass(/light/);
    }
});

test('unsupported dashboard roles render the not-found boundary', async ({ page }) => {
    await page.goto('/unsupported/someone/dashboard');

    await expect(page.getByRole('heading', { name: 'Portfolio not found' })).toBeVisible();
});

test('missing portfolios render the not-found boundary during server loading', async ({ page }) => {
    await page.goto('/client/missing/dashboard');

    await expect(page.getByRole('heading', { name: 'Portfolio not found' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Return home' })).toBeVisible();
});

test('authentication forms expose correct labels and browser metadata', async ({ page }) => {
    await page.goto('/auth/login');

    await expect(page.getByRole('heading', { name: 'Sign in to your portfolio' })).toBeVisible();
    await expect(page.getByLabel('Email')).toHaveAttribute('type', 'email');
    await expect(page.getByLabel('Email')).toHaveAttribute('autocomplete', 'email');
    await expect(page.getByLabel('Password')).toHaveAttribute('autocomplete', 'current-password');

    await page.goto('/auth/register');
    await expect(page.getByLabel('Password')).toHaveAttribute('autocomplete', 'new-password');
});

test('an unconfirmed token does not trap users on the email page', async ({ context, page }) => {
    const payload = Buffer.from(JSON.stringify({
        exp: Math.floor(Date.now() / 1000) + 3600,
        IsConfirmed: 'False',
    })).toString('base64url');
    await context.addCookies([{
        name: 'AccessToken',
        value: `eyJhbGciOiJub25lIn0.${payload}.`,
        domain: 'localhost',
        path: '/',
    }]);

    await page.goto('/auth/login');
    await expect(page.getByRole('heading', { name: 'Sign in to your portfolio' })).toBeVisible();
    await expect(page).toHaveURL(/\/auth\/login$/);
});

test('login rejects short and incorrect passwords without redirecting to email', async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByLabel('Email').fill('demo@example.com');
    await page.getByLabel('Password').fill('short');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page.getByText('Password must be at least 8 characters long')).toBeVisible();
    await expect(page).toHaveURL(/\/auth\/login$/);

    await page.getByLabel('Password').fill('WrongPassword1!');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page.getByText('Wrong username/password')).toBeVisible();
    await expect(page).toHaveURL(/\/auth\/login$/);
});

test('public dashboard is responsive and its contact dialog supports Escape', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/client/demo/dashboard');

    await expect(page.getByRole('heading', { name: 'Demo Portfolio' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);

    await page.getByRole('button', { name: 'Send Message' }).click();
    const dialog = page.getByRole('dialog', { name: 'Send Message' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByLabel('Full name')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
});

test('owner settings preserve the parent dialog when a nested preference closes', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/owner/demo/dashboard');

    await expect(page.getByRole('heading', { name: 'Demo Portfolio' })).toBeVisible();
    await page.getByRole('button', { name: 'Settings' }).click();
    const settingsDialog = page.getByRole('dialog', { name: 'Settings' });
    await expect(settingsDialog).toBeVisible();

    await settingsDialog.getByRole('button', { name: 'Preferences', exact: true }).click();
    await settingsDialog.getByRole('button', { name: 'Change theme' }).click();
    const themeDialog = page.getByRole('dialog', { name: 'Change theme' });
    await expect(themeDialog).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(themeDialog).toBeHidden();
    await expect(settingsDialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(settingsDialog).toBeHidden();
});

test('key routes pass baseline accessibility and responsive structure checks', async ({ page }) => {
    const routes = ['/', '/auth/login', '/auth/register', '/auth/email', '/search', '/client/demo/dashboard'];
    const viewports = [
        { width: 390, height: 844 },
        { width: 1440, height: 900 },
    ];

    for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        for (const route of routes) {
            await page.goto(route);
            if (route.includes('/dashboard')) {
                await expect(page.getByRole('heading', { name: 'Demo Portfolio' })).toBeVisible();
            }

            const audit = await page.evaluate(() => {
                const accessibleName = (element: Element) => {
                    const labelledBy = element.getAttribute('aria-labelledby');
                    const labelledText = labelledBy
                        ?.split(/\s+/)
                        .map(id => document.getElementById(id)?.textContent?.trim())
                        .filter(Boolean)
                        .join(' ');
                    return element.getAttribute('aria-label')?.trim()
                        || labelledText
                        || element.textContent?.trim()
                        || element.getAttribute('title')?.trim()
                        || '';
                };
                const visible = (element: Element) => {
                    const style = getComputedStyle(element);
                    return style.display !== 'none' && style.visibility !== 'hidden';
                };
                const ids = Array.from(document.querySelectorAll('[id]')).map(element => element.id);
                const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
                const unlabeledFields = Array.from(document.querySelectorAll('input:not([type="hidden"]), textarea, select'))
                    .filter(visible)
                    .filter(field => {
                        const id = field.getAttribute('id');
                        return !field.getAttribute('aria-label')
                            && !field.getAttribute('aria-labelledby')
                            && !(id && document.querySelector(`label[for="${CSS.escape(id)}"]`));
                    });
                const unnamedControls = Array.from(document.querySelectorAll('button, [role="button"]'))
                    .filter(visible)
                    .filter(control => !accessibleName(control));
                const imagesWithoutAlt = Array.from(document.querySelectorAll('img')).filter(image => !image.hasAttribute('alt'));

                return {
                    duplicateIds: [...new Set(duplicateIds)],
                    headingCount: document.querySelectorAll('h1').length,
                    horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
                    imagesWithoutAlt: imagesWithoutAlt.length,
                    unlabeledFields: unlabeledFields.length,
                    unnamedControls: unnamedControls.length,
                };
            });

            expect(audit, `${route} at ${viewport.width}px`).toEqual({
                duplicateIds: [],
                headingCount: 1,
                horizontalOverflow: false,
                imagesWithoutAlt: 0,
                unlabeledFields: 0,
                unnamedControls: 0,
            });
        }
    }
});
